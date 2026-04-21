export interface ResultadoValidacion {
  permitido: boolean;
  mensaje: string;
  visitante_nombre?: string;
  motivo_denegacion?: string;
}