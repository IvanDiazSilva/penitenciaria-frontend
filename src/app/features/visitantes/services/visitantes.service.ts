import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visitante } from '../models/visitante.model';

@Injectable({
  providedIn: 'root'
})
export class VisitantesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitantes';

  preregistrarVisitante(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/preregistro`, request);
  }

  getVisitantesPendientes(): Observable<Visitante[]> {
    return this.http.get<Visitante[]>(`${this.apiUrl}?estado=PENDIENTE`);
  }

  aprobarVisitante(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/estado`, {
      estado: 'APROBADO'
    });
  }

  rechazarVisitante(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/estado`, {
      estado: 'DENEGADO'
    });
  }
}