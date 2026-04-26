import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visita } from '../models/visita.model'; 

@Injectable({
  providedIn: 'root'
})
export class VisitaService { // Mantenemos tu nombre en singular
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitas';

  constructor() {}

  // --- TUS MÉTODOS ORIGINALES (No tocamos nada) ---

  getAllVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(this.apiUrl);
  }

  createVisita(visita: Visita): Observable<Visita> {
    return this.http.post<Visita>(this.apiUrl, visita);
  }

  deleteVisita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // --- MÉTODOS ADICIONALES (Para que no falte funcionalidad) ---

  getVisitaById(id: number): Observable<Visita> {
    return this.http.get<Visita>(`${this.apiUrl}/${id}`);
  }

  actualizarVisita(id: number, visita: Visita): Observable<Visita> {
    return this.http.put<Visita>(`${this.apiUrl}/${id}`, visita);
  }

  validarQrVisita(codigoQr: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validar-qr`, { codigoQr });
  }
}