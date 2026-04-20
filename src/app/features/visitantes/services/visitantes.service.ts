import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visitante } from '../models/visitante.model';
import { PreregistroVisitanteRequest } from '../models/preregistro-visitante-request.model';

@Injectable({
  providedIn: 'root'
})
export class VisitantesService {
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitantes';

  constructor(private http: HttpClient) {}

  getVisitantes(): Observable<Visitante[]> {
    return this.http.get<Visitante[]>(this.apiUrl);
  }

  getVisitanteById(id: number): Observable<Visitante> {
    return this.http.get<Visitante>(`${this.apiUrl}/${id}`);
  }

  createVisitante(visitante: Visitante): Observable<Visitante> {
    return this.http.post<Visitante>(this.apiUrl, visitante);
  }

  updateVisitante(id: number, visitante: Visitante): Observable<Visitante> {
    return this.http.put<Visitante>(`${this.apiUrl}/${id}`, visitante);
  }

  deleteVisitante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  preregistrarVisitante(request: PreregistroVisitanteRequest): Observable<Visitante> {
    return this.http.post<Visitante>(`${this.apiUrl}/preregistro`, request);
  }
}