import pandas as pd
from dotenv import load_dotenv
import requests, os, json
from datetime import datetime
import numpy as np

load_dotenv()

class SheetsToJSON:
    def __init__(self):
        self.get_data()

    def get_data(self):
        df = pd.read_csv('sheets-to-json/01. COMPILADO 2025 - Serviços.csv')
        df = df.replace({np.nan: None})
        items = list()
        for index, i in enumerate(df.itertuples(False)):
            row = index + 2
            item = self.make_to_json(list(i), row)
            items.append(item)

            if len(items) == 1000:
                print(f'Row: {index + 1}')
                status = self.send_data(items)
                if status != 200:
                    break
                items = list()
        
        status = self.send_data(items)
            

    def try_parse_float(self, value):
        value = str(value).replace(',', '.')
        try:
            return round(float(value), 2)
        except Exception:
            return 0
    
    def try_parse_date(self, value: str):
        formatos = [
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%d",  
            "%d/%m/%Y",
            "%d-%m-%Y",
        ]
        
        for fmt in formatos:
            try:
                return datetime.strptime(str(value), fmt).date().isoformat()
            except ValueError:
                continue
        
        # última tentativa: ISO 8601
        try:
            return datetime.fromisoformat(str(value)).date().isoformat()
        except Exception:
            return None

    def make_to_json(self, data: list, linha_atual):
        print(type(data[3]), data[3])
        dataServico = self.try_parse_date(data[3])
        dataInclusao = self.try_parse_date(data[4])

        valorTotal      = self.try_parse_float(data[33])
        custoAdicional  = self.try_parse_float(data[34])
        deslocamento    = self.try_parse_float(data[30])
        deslocamento_km = self.try_parse_float(data[23])
        franquia        = self.try_parse_float(data[26])
        valorKm         = self.try_parse_float(data[28])
        pedagio         = self.try_parse_float(data[27])
        maoObra         = self.try_parse_float(data[32])

        return {
            "row_id": f"2025_{linha_atual}",
            "status": data[1],
            "ordem_de_servico": data[2],
            "data_servico": dataServico,
            "data_inclusao": dataInclusao,
            "classificacao": data[5],
            "cliente": data[7],
            "esn": data[8],
            "numero_cobli": data[9],
            "produto": data[11],
            "classificacao_produto": data[12],
            "status_ordem": data[13],
            "no_show": data[14],
            "observacao": data[15],
            "local_da_os": data[16],
            "prestador": data[17],
            "responsavel_finalizacao": data[18],
            "tabela_pagamento": data[19],
            "id_visita": data[20],
            "deslocamento_km": deslocamento_km,
            "franquia": franquia,
            "pedagio": pedagio,
            "valor_km": valorKm,
            "id_instalacao": data[29],
            "deslocamento": deslocamento,
            "custo_adicional": custoAdicional,
            "mao_de_obra": maoObra,
            "cobli_instalador": data[34],
            "fechamento": data[35],
            "consultor": data[36],
            "tpServico": data[6],
            "placa": data[10],
            "valorTotal": valorTotal
        }

    def get_auth_token(self) -> str:
        headers={
            "Content-Type": "application/json"
        }

        auth = {
            "email": os.getenv('USER_AUTH'),
            "password": os.getenv('PSWD')
        }

        response = requests.post(f'{os.getenv("BASE_URL")}/authentication/finalizator', data=json.dumps(auth), headers=headers).json()
        return response['token']
    
    def send_data(self, items: dict):
        header = {
            "X-API-KEY": self.get_auth_token(), 
            'Content-Type': 'application/json'
        }

        response = requests.post(f'{os.getenv("BASE_URL")}/service-cost/save-items', data=json.dumps(items), headers=header)

        if response.status_code != 200:
            open('sheets-to-json/erro.json', '+a').write(str(items))
            print(response.text)
        return response.status_code
    

SheetsToJSON()