export interface Visita {
  id: number;
  reo_id: number;
  visitante_nombre: string;
  visitante_dni: string;
  fecha_visita: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  autorizado: boolean;
  codigo_qr: string;
}