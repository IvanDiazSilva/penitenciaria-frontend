import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visita } from '../models/visita.model';
import { CrearVisitaRequest } from '../models/crear-visita.request';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Definimos las interfaces aquí o impórtalas si las tienes en archivos aparte
export interface GenerarQrResponse {
  mensaje: string;
  qr: string;
  visitaId: number;
}

export interface ValidarQrResponse {
  valido: boolean;
  visitante?: string;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitasService {
  private http = inject(HttpClient);
  // Nota: La URL base ya termina en /visitas
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitas';

  getAllVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(this.apiUrl);
  }

  getMisVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiUrl}/mis-citas`);
  }

  getVisitaById(id: number): Observable<Visita> {
    return this.http.get<Visita>(`${this.apiUrl}/${id}`);
  }

  crearVisita(payload: CrearVisitaRequest): Observable<Visita> {
    return this.http.post<Visita>(this.apiUrl, payload);
  }

  actualizarVisita(id: number, payload: Partial<Visita>): Observable<Visita> {
    return this.http.put<Visita>(`${this.apiUrl}/${id}`, payload);
  }

  deleteVisita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generarQr(id: number): Observable<GenerarQrResponse> {
    return this.http.post<GenerarQrResponse>(`${this.apiUrl}/qr/${id}`, {});
  }

  /**
   * Método corregido: 
   * Recibe un string, pero envía un objeto JSON al backend.
   */
  validarQr(qrCode: string): Observable<ValidarQrResponse> {
  return this.http.post<ValidarQrResponse>(`${this.apiUrl}/validar-qr`, { qr: qrCode })
    .pipe(
      timeout(5000), // Si tarda más de 5s, salta al bloque error
      catchError(err => throwError(() => err))
    );
}
}