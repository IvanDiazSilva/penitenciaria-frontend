import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Visita } from '../models/visita.model';

@Injectable({
  providedIn: 'root'
})
export class VisitaService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitas';

  getAllVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(this.apiUrl);
  }

  getMisVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiUrl}/mis-citas`);
  }

  getVisitaById(id: number): Observable<Visita> {
    return this.http.get<Visita>(`${this.apiUrl}/${id}`);
  }

  crearVisita(payload: any): Observable<Visita> {
    return this.http.post<Visita>(this.apiUrl, payload);
  }

  actualizarVisita(id: number, payload: any): Observable<Visita> {
    return this.http.put<Visita>(`${this.apiUrl}/${id}`, payload);
  }

  deleteVisita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}