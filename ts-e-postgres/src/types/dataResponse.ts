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
  NºCOBLI: string | null;
  PLACA: string | null;
  PRODUTO: string | null;
  CLASSIFICAÇÃO_PRODUTO: string | null;
  PRESTADOR: string | null;
  FINALIZADOR: string | null;
}
