import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visita } from '../models/visitas.model';

@Injectable({
  providedIn: 'root'
})
export class VisitasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitas';

  getVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(this.apiUrl);
  }

  getVisitaById(id: number): Observable<Visita> {
    return this.http.get<Visita>(`${this.apiUrl}/${id}`);
  }

  crearVisita(visita: Visita): Observable<Visita> {
    return this.http.post<Visita>(this.apiUrl, visita);
  }

  actualizarVisita(id: number, visita: Visita): Observable<Visita> {
    return this.http.put<Visita>(`${this.apiUrl}/${id}`, visita);
  }

  eliminarVisita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  validarQrVisita(codigoQr: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validar-qr`, { codigoQr });
  }
}