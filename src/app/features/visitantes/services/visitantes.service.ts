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

  getVisitantes(): Observable<Visitante[]> {
    return this.http.get<Visitante[]>(this.apiUrl);
  }

  getVisitanteById(id: number): Observable<Visitante> {
    return this.http.get<Visitante>(`${this.apiUrl}/${id}`);
  }

  crearVisitante(visitante: Visitante): Observable<Visitante> {
    return this.http.post<Visitante>(this.apiUrl, visitante);
  }

  actualizarVisitante(id: number, visitante: Visitante): Observable<Visitante> {
    return this.http.put<Visitante>(`${this.apiUrl}/${id}`, visitante);
  }

  eliminarVisitante(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  aprobarVisitante(id: number): Observable<Visitante> {
    return this.http.patch<Visitante>(`${this.apiUrl}/${id}/aprobar`, {});
  }

  denegarVisitante(id: number): Observable<Visitante> {
    return this.http.patch<Visitante>(`${this.apiUrl}/${id}/denegar`, {});
  }
}