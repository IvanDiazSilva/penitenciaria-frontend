export interface ValidacionQrResponse {
  valido: boolean;
  mensaje: string;
  visitaId?: number;
  visitanteNombre?: string;
  visitanteDni?: string;
  fechaVisita?: string;
  horaEntrada?: string;
  horaSalida?: string;
  autorizado?: boolean;
}