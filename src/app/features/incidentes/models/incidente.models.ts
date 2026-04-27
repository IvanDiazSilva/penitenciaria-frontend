/**
 * Modelo que representa la entidad de Incidentes en la base de datos.
 * Refleja la estructura de la tabla 'incidentes' y permite la comunicación con el Backend.
 */
export interface Incidente {
  // El ID es opcional (?) porque en las ALTAS la base de datos lo genera automáticamente (SERIAL/AUTO_INCREMENT)
  id?: number;

  // Corresponde a la columna 'tipo' (ej: Pelea, Médico, Intento de fuga)
  tipo: string;

  // Corresponde a la columna 'descripcion'
  descripcion: string;

  // Llave foránea que conecta con el guardia (id_guardia en SQL)
  // En tu caso, actualmente usamos el valor constante 1
  idGuardia: number;

  // Corresponde a 'fecha_hora'. 
  // Usamos 'any' o 'Date | string' para que p-calendar y la API se entiendan sin errores de tipo.
  fechaHora: any;

  // Llave foránea que conecta con el reo involucrado (id_reo en SQL)
  idReo: number;
}