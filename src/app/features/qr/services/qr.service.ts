import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrService {
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/qr';

  constructor(private http: HttpClient) {}

  generarQr(idVisita: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/visita/${idVisita}`);
  }

  validarQr(codigoQr: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validar`, { codigoQr });
  }
}
