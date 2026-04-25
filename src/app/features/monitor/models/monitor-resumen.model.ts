export interface MonitorStats {
  reoTotal: number;
  visitasTotal: number;
  incidentesTotal: number;
}

export interface MonitorVisitasHoy {
  fecha: string;
  total: number;
  autorizados: number;
}

export interface MonitorInforme {
  mensaje: string;
  fecha: string;
  reoTotal: number;
  visitasTotal: number;
  incidentesTotal: number;
  visitasHoy: number;
}

export interface MonitorInformeFiltros {
  reoId: number | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
}

export interface ReoOption {
  id: number;
  nombre: string;
  dni: string;
  delito: string;
}