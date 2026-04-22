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
  estado?: 'PENDIENTE' | 'APROBADO' | 'DENEGADO';
  fechaCreacion?: string;
}