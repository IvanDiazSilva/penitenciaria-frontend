export interface SolicitudVisitante {
  id: number;
  nombreCompleto: string; 
  dniNie: string;        
  nacionalidad?: string;
  telefono?: string;
  email: string;
  direccion?: string;
  nombreInterno: string; 
  parentesco: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  aceptaNormativa?: boolean;
}