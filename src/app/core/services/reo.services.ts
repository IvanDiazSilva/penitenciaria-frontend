import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reo {
  id: number;
  nombre: string;
  apellidos: string;
  codigoUnico: string;
  fechaEntrada: string;
  fechaSalida: string | null;
  observaciones: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ReoService {
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/reos';

  constructor(private http: HttpClient) {}

  getReos(): Observable<Reo[]> {
    return this.http.get<Reo[]>(this.apiUrl);
  }
}