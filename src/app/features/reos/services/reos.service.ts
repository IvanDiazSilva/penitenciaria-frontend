import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reo } from '../models/reo.model';

@Injectable({
  providedIn: 'root'
})
export class ReosService {
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/reos';

  constructor(private http: HttpClient) {}

  getReos(): Observable<Reo[]> {
    return this.http.get<Reo[]>(this.apiUrl);
  }

  getReoById(id: number): Observable<Reo> {
    return this.http.get<Reo>(`${this.apiUrl}/${id}`);
  }

  createReo(reo: Reo): Observable<Reo> {
    return this.http.post<Reo>(this.apiUrl, reo);
  }

  updateReo(id: number, reo: Reo): Observable<Reo> {
    return this.http.put<Reo>(`${this.apiUrl}/${id}`, reo);
  }

  deleteReo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}