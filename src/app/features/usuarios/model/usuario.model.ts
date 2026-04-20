export interface Usuario {
  id?: number;
  username: string;
  password?: string;
  rol: 'ADMIN' | 'GUARDIA' | 'VISITANTE';
}