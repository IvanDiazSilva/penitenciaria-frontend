import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformesService {
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/informes';

  constructor(private http: HttpClient) {}

  getResumenGeneral(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumen`);
  }

  getInformeVisitas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/visitas`);
  }

  getInformeIncidentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidentes`);
  }

  downloadInformePdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, {
      responseType: 'blob'
    });
  }

  downloadInformeExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/excel`, {
      responseType: 'blob'
    });
  }
}