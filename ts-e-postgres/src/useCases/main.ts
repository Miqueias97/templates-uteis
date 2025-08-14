import * as dotenv from "dotenv";
import sheetsApi from "../drivers/sheetsApi";
import {
  ApiResponse,
  DeviceResponse,
  OrderResponse,
} from "../types/dataResponse";
import queryExecute from "../drivers/postgres";

dotenv.config();

// request api
const get_devices = async (): Promise<Record<string, string>> => {
  const items: Record<string, string> = {};
  const data = await sheetsApi.get<ApiResponse<DeviceResponse>>(
    `/${process.env.SHEET_ID}&page=1&perPage=547&aba=1866250139`
  );

  data.data.items.map((i) => {
    const ticket_id = `${i.TICKETID}`;
    const item = devices_insert_mock(i);

    if (ticket_id in items) {
      let query = items[ticket_id];
      query += item;
      items[ticket_id] = query;
    } else {
      items[ticket_id] = item;
    }
  });

  return items;
};

const get_orders = async (): Promise<Record<string, string>> => {
  const items: Record<string, string> = {};
  const data = await sheetsApi.get<ApiResponse<OrderResponse>>(
    `/${process.env.SHEET_ID}&page=1&perPage=97&aba=0`
  );

  data.data.items.map((i) => {
    const ticket_id = `${i.TICKETID}`;
    const item = order_insert_mock(i);

    if (!(ticket_id in items)) {
      items[ticket_id] = item;
    }
  });
  return items;
};

// Mock query insert
const devices_insert_mock = (item: DeviceResponse) => {
  return `
    INSERT INTO finalizacao.dispositivos (
      "ordem_de_servico", "numero_cobli",
      "tipo_servico", "esn",
      "placa", "produto"
    ) VALUES (
     '${item.TICKETID}', '${item.N_COBLI}',
     '${item.TIPO_SERVICO}', '${item.ESN}',
     '${item.PLACA}', '${item.PRODUTO}'
    );
    `;
};

const order_insert_mock = (item: OrderResponse) => {
  return `
    INSERT INTO finalizacao.os_finalizadas (
        ordem_de_servico, data_servico,
        data_inclusao, classificacao,
        cliente, status,
        prestador, responsavel_finalizacao,
        local_da_os, motivo_no_show
    ) VALUES (
      '${item.TICKETID}', '${
    item.DATA_SERVICO
      ? new Date(item.DATA_SERVICO).toISOString().split("T")[0]
      : ""
  }',
      '${
        item.DATA_INCLUSAO
          ? new Date(item.DATA_INCLUSAO).toISOString().split("T")[0]
          : ""
      }', '${item.CLASSIFICACAO}',
      '${item.CLIENTE}', '${item.STATUS}',
      '${item.PRESTADOR}', '${item.FINALIZADOR}',
      '${item.ENDERECO}', '${item.NO_SHOW}'
    );
  `;
};

// executar
const main = async () => {
  const ordens = await get_orders();
  const dispositivos = await get_devices();

  let query_insert = ``;
  const items = Object.keys(ordens)
    .map((i) => `'${i}'`)
    .join(", ");

  let search = `
  SELECT * 
  FROM finalizacao.dispositivos 
  WHERE ordem_de_servico IN (${items})
`;
  console.log(search);
  Object.keys(ordens).map((ordem) => {
    const order_insert = ordens[ordem];
    let dispositivos_insert = dispositivos[ordem];

    if (dispositivos_insert === undefined) {
      dispositivos_insert = "";
    }
    query_insert += `
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM finalizacao.os_finalizadas WHERE ordem_de_servico = '${ordem}'
          ) THEN
              ${order_insert}
              ${dispositivos_insert}
          END IF;
      END;
      $$ LANGUAGE plpgsql;
    `;
  });

  queryExecute(query_insert)
    .then((i) => console.log(`Insert realizado com sucesso`))
    .catch((err) => {
      console.error(`Erro ao realizar insert: ${err}`);
    });
};

main();
