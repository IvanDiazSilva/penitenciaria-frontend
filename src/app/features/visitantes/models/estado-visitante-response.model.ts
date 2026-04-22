export interface EstadoVisitanteResponse {
  dniNie: string;
  nombreCompleto: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'DENEGADO';
}