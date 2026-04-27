import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreregistroVisitanteRequest } from '../models/preregistro-visitante.request';

@Injectable({
  providedIn: 'root'
})
export class VisitantesService {

  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitantes';

  constructor(private http: HttpClient) {}

  preregistrarVisitante(data: PreregistroVisitanteRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/preregistro`, data);
  }
}