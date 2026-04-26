export interface PreregistroVisitanteRequest {
  nombreCompleto: string;
  dniNie: string;
  password: string;
  nacionalidad?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  parentesco?: string | null;
  aceptaNormativa?: boolean | null;
}