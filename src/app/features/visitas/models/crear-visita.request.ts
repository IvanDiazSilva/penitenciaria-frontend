export interface CrearVisitaRequest {
  reoId: number;
  fechaVisita: string;
  horaEntrada?: string | null;
  horaSalida?: string | null;
}