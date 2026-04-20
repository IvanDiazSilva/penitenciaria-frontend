import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// La interfaz debe ser EXACTAMENTE como el JSON de Postman
export interface Reo {
  id: number;
  nombre: string;
  dni: string;
  delito: string;
}



@Injectable({
  providedIn: 'root'
})
export class ReoService {
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/reos';

  constructor(private http: HttpClient) {}

  // Cambiamos el nombre a getAllReos para que sea más claro
  getAllReos(): Observable<Reo[]> {
    return this.http.get<Reo[]>(this.apiUrl);
  }
  createReo(reo: Reo): Observable<Reo> {
  return this.http.post<Reo>(this.apiUrl, reo);
}
}