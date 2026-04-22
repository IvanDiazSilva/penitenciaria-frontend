import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ValidacionQrResponse } from '../models/validacion-qr-response.model';

@Injectable({
  providedIn: 'root'
})
export class ValidacionQrService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitas';

  validarCodigoQr(codigoQr: string): Observable<ValidacionQrResponse> {
    return this.http.post<ValidacionQrResponse>(`${this.apiUrl}/validar-qr`, {
      codigoQr
    });
  }
}