import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InformeFiltros {
  reoId: number | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class InformesService {
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api';

  constructor(private http: HttpClient) {}

  obtenerResumenGeneral(filtros?: InformeFiltros): Observable<any> {
    let params = new HttpParams();

    if (filtros?.reoId != null) {
      params = params.set('reoId', filtros.reoId.toString());
    }

    if (filtros?.fechaDesde) {
      params = params.set('fechaDesde', filtros.fechaDesde);
    }

    if (filtros?.fechaHasta) {
      params = params.set('fechaHasta', filtros.fechaHasta);
    }

    return this.http.get<any>(`${this.apiUrl}/monitor/informe`, { params });
  }

  descargarInformePdf(filtros?: InformeFiltros): Observable<Blob> {
    let params = new HttpParams();

    if (filtros?.reoId != null) {
      params = params.set('reoId', filtros.reoId.toString());
    }

    if (filtros?.fechaDesde) {
      params = params.set('fechaDesde', filtros.fechaDesde);
    }

    if (filtros?.fechaHasta) {
      params = params.set('fechaHasta', filtros.fechaHasta);
    }

    return this.http.get(`${this.apiUrl}/monitor/informe/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  obtenerReos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reos`);
  }
}