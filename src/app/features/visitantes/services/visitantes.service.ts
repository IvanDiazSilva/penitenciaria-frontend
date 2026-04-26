import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visitante } from '../models/visitante.model';

export interface EstadoVisitanteResponse {
  dniNie: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'DENEGADO';
  nombreCompleto: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitantesService {
  private readonly apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitantes';

  constructor(private http: HttpClient) {}

  consultarEstadoPorDni(dniNie: string): Observable<EstadoVisitanteResponse> {
    return this.http.get<EstadoVisitanteResponse>(`${this.apiUrl}/estado/${dniNie}`);
  }

  getVisitantes(): Observable<Visitante[]> {
    return this.http.get<Visitante[]>(this.apiUrl);
  }

  actualizarEstadoVisitante(
    id: number,
    estado: 'APROBADO' | 'DENEGADO' | 'PENDIENTE'
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, { estado });
  }

  aprobarVisitante(id: number): Observable<any> {
    return this.actualizarEstadoVisitante(id, 'APROBADO');
  }

  denegarVisitante(id: number): Observable<any> {
    return this.actualizarEstadoVisitante(id, 'DENEGADO');
  }
}