import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreregistroVisitanteRequest } from '../models/preregistro-visitante-request.model';
import { Visitante } from '../models/visitante.model';

@Injectable({
  providedIn: 'root'
})
export class PreregistroService {
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitantes';

  constructor(private http: HttpClient) {}

  preregistrarVisitante(request: PreregistroVisitanteRequest): Observable<Visitante> {
    return this.http.post<Visitante>(`${this.apiUrl}/preregistro`, request);
  }
}