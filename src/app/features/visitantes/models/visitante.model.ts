import { EstadoVisitante } from "./estado-visitante.type";

export interface Visitante {
  id?: number;
  nombreCompleto: string;
  dniNie: string;
  nacionalidad?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  parentesco?: string;
  aceptaNormativa?: boolean;
  estado?: EstadoVisitante;
  fechaCreacion?: string;
  usuarioId?: number | null;
  reoId?: number | null;
}