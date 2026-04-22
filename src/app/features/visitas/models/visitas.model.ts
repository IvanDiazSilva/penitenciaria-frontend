export interface Visita {
  id?: number;
  reo: {
    id: number;
    nombre?: string | null;
    dni?: string | null;
    delito?: string | null;
  };
  visitanteNombre: string;
  visitanteDni: string;
  fechaVisita: string;
  horaEntrada: string;
  horaSalida?: string | null;
  autorizado: boolean;
  codigoQr?: string | null;
}