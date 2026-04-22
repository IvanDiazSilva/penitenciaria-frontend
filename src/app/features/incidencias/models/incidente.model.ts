export interface Incidente {
  id?: number;
  tipo: string;
  descripcion: string;
  fechaHora: string;
  guardia: {
    id: number;
    username?: string;
    rol?: string;
  };
  reo?: {
    id: number;
    nombre?: string | null;
    dni?: string | null;
    delito?: string | null;
  } | null;
}