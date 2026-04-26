export interface Visitante {
  id?: number;
  nombreCompleto: string;
  dniNie: string;
  nacionalidad?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  parentesco?: string | null;
  aceptaNormativa?: boolean | null;
  estado?: 'PENDIENTE' | 'APROBADO' | 'DENEGADO' | string;
  fechaCreacion?: string | null;
  usuario?: {
    id?: number;
    username?: string;
    rol?: string;
  } | null;
}