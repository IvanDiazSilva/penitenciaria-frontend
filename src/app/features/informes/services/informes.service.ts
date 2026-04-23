import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformesService {
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/monitor/informe';

  constructor(private http: HttpClient) {}

  obtenerResumenGeneral(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

 obtenerResumenGeneralFiltrado(filtros: { fecha?: string; tipo?: string }): Observable<any> {
  let params = new HttpParams();

  if (filtros.fecha && filtros.fecha.trim() !== '') {
    params = params.set('fecha', filtros.fecha);
  }

  if (filtros.tipo && filtros.tipo.trim() !== '' && filtros.tipo !== 'general') {
    params = params.set('tipo', filtros.tipo);
  }

  return this.http.get<any>(this.apiUrl, { params });
}

  descargarInformePdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, {
      responseType: 'blob'
    });
  }
}