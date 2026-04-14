export interface Visita {
  id: number;
  visitanteNombre: string;
  visitanteDni: string;
  fechaVisita: string;
  horaEntrada: string | null;
  horaSalida: string | null;
  autorizado: boolean | null;
  codigoQr: string | null;
  reo?: {
    id: number;
  };
}