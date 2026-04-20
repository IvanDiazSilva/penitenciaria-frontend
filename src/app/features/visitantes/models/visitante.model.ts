export interface Visitante {
  id?: number;
  nombreCompleto: string;
  dniNie: string;
  nacionalidad: string;
  telefono: string;
  email: string;
  direccion: string;
  nombreInterno: string;
  parentesco: string;
  aceptaNormativa: boolean;
  estado: 'PENDIENTE' | 'APROBADO' | 'DENEGADO';
  usuarioId: number;
}