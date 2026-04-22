import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PreregistroVisitanteRequest } from '../models/preregistro-visitante.request.model';
import { EstadoVisitanteResponse } from '../models/estado-visitante-response.model';

@Injectable({
  providedIn: 'root'
})
export class VisitantesPublicService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitantes-public';

  preregistrarVisitante(data: PreregistroVisitanteRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/preregistro`, data);
  }

  consultarEstado(dniNie: string): Observable<EstadoVisitanteResponse> {
    return this.http.get<EstadoVisitanteResponse>(`${this.apiUrl}/estado/${dniNie}`);
  }
}