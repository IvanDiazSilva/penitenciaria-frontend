import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visita } from '../models/visita.model'; // Importamos el modelo que acabas de crear

@Injectable({
  providedIn: 'root'
})
export class VisitaService {
  private http = inject(HttpClient);
  // Esta será la URL de la API de visitas
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitas';

  constructor() {}

  // Obtener todas las visitas
  getAllVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(this.apiUrl);
  }

  // Crear una nueva visita
  createVisita(visita: Visita): Observable<Visita> {
    return this.http.post<Visita>(this.apiUrl, visita);
  }

  // Borrar una visita
  deleteVisita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}