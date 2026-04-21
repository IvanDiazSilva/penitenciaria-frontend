export interface SolicitudVisitante {
  id: number;
  nombreCompleto: string;
  dniNie: string;
  email: string;
  telefono: string;
  nombreInterno: string;
  parentesco: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
}