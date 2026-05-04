export interface PreregistroVisitanteRequest {
  nombreCompleto: string;
  dniNie: string;
  password: string;
  nacionalidad?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  parentesco?: string;
  aceptaNormativa: boolean;
}