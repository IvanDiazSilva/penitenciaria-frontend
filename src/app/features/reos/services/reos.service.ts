import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reo } from '../models/reo.model';

@Injectable({
  providedIn: 'root'
})
export class ReosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/reos';

  getReos(): Observable<Reo[]> {
    return this.http.get<Reo[]>(this.apiUrl);
  }

  getReoById(id: number): Observable<Reo> {
    return this.http.get<Reo>(`${this.apiUrl}/${id}`);
  }

  crearReo(reo: Reo): Observable<Reo> {
    return this.http.post<Reo>(this.apiUrl, reo);
  }

  actualizarReo(id: number, reo: Reo): Observable<Reo> {
    return this.http.put<Reo>(`${this.apiUrl}/${id}`, reo);
  }

  eliminarReo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}