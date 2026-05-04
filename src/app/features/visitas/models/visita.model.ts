export interface Visita {
  id?: number;
  reo: {
    id: number;
    nombre?: string | null;
    dni?: string | null;
    delito?: string | null;
  };
  visitante: {
    id: number;
    nombreCompleto?: string | null;
    dniNie?: string | null;
    nacionalidad?: string | null;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
    parentesco?: string | null;
    aceptaNormativa?: boolean | null;
    estado?: string | null;
    fechaCreacion?: string | null;
  };
  fechaVisita: string;
  horaEntrada?: string | null;
  horaSalida?: string | null;
  autorizado: boolean;
  codigoQr?: string | null;
}