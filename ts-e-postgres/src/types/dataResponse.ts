export interface ApiResponse<T> {
  status: string;
  items: T[];
}

export interface DeviceResponse {
  TICKETID: string | null;
  DATA_SERVICO: string | null;
  DATA_INCLUSAO: string | null;
  CLASSIFICACAO: string | null;
  TIPO_SERVICO: string | null;
  CLIENTE: string | null;
  ESN: string | null;
  N_COBLI: string | null;
  PLACA: string | null;
  PRODUTO: string | null;
  CLASSIFICACAO_PRODUTO: string | null;
  PRESTADOR: string | null;
  FINALIZADOR: string | null;
}

export interface OrderResponse {
  TICKETID: string | null;
  DATA_SERVICO: string | null;
  DATA_INCLUSAO: string | null;
  CLASSIFICACAO: string | null;
  TIPO_SERVICO: string | null;
  CLIENTE: string | null;
  ESN: string | null;
  N_COBLI: string | null;
  PLACA: string | null;
  PRODUTO: string | null;
  CLASSIFICACAO_PRODUTO: string | null;
  STATUS: string | null;
  NO_SHOW: string | null;
  OBSERVACAO: string | null;
  ENDERECO: string | null;
  PRESTADOR: string | null;
  FINALIZADOR: string | null;
}
