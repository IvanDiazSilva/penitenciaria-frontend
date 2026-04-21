export interface Reo {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  numero_celda: string;
  fecha_ingreso: string;
  delito?: string;
  estado: 'Activo' | 'Trasladado' | 'Libertad';
}