import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MonitorStats,
  MonitorVisitasHoy,
  MonitorInforme,
  MonitorInformeFiltros,
  ReoOption
} from '../models/monitor-resumen.model';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {
  private readonly baseApiUrl = 'http://localhost:8080/penitenciaria-api/api';
  private readonly monitorUrl = `${this.baseApiUrl}/monitor`;
  private readonly reosUrl = `${this.baseApiUrl}/reos`;

  constructor(private http: HttpClient) {}

  obtenerStats(): Observable<MonitorStats> {
    return this.http.get<MonitorStats>(this.monitorUrl);
  }

  obtenerVisitasHoy(): Observable<MonitorVisitasHoy> {
    return this.http.get<MonitorVisitasHoy>(`${this.monitorUrl}/visitas-hoy`);
  }

  obtenerInforme(filtros?: MonitorInformeFiltros): Observable<MonitorInforme> {
    const params = this.buildParams(filtros);

    return this.http.get<MonitorInforme>(`${this.monitorUrl}/informe`, { params });
  }

  descargarInformePdf(filtros?: MonitorInformeFiltros): Observable<Blob> {
    const params = this.buildParams(filtros);

    return this.http.get(`${this.monitorUrl}/informe/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  obtenerReos(): Observable<ReoOption[]> {
    return this.http.get<ReoOption[]>(this.reosUrl);
  }

  private buildParams(filtros?: MonitorInformeFiltros): HttpParams {
    let params = new HttpParams();

    if (!filtros) {
      return params;
    }

    if (filtros.reoId !== null && filtros.reoId !== undefined) {
      params = params.set('reoId', filtros.reoId.toString());
    }

    if (filtros.fechaDesde) {
      params = params.set('fechaDesde', filtros.fechaDesde);
    }

    if (filtros.fechaHasta) {
      params = params.set('fechaHasta', filtros.fechaHasta);
    }

    return params;
  }
}