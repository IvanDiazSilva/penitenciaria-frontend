import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incidente } from '../models/incidente.model';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/incidentes';

  getIncidencias(): Observable<Incidente[]> {
    return this.http.get<Incidente[]>(this.apiUrl);
  }

  getIncidenciaById(id: number): Observable<Incidente> {
    return this.http.get<Incidente>(`${this.apiUrl}/${id}`);
  }

  crearIncidencia(incidencia: Incidente): Observable<Incidente> {
    return this.http.post<Incidente>(this.apiUrl, incidencia);
  }

  actualizarIncidencia(id: number, incidencia: Incidente): Observable<Incidente> {
    return this.http.put<Incidente>(`${this.apiUrl}/${id}`, incidencia);
  }

  eliminarIncidencia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}