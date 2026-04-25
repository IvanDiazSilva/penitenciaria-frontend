import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudVisitante } from '../models/validacion-visitante.models';

@Injectable({
  providedIn: 'root'
})
export class ValidacionVisitanteService {
  // URL exacta según la captura de Postman de tu compañero
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/visitantes'; 

  constructor(private http: HttpClient) {}

  /** Obtiene la lista de visitantes */
  obtenerSolicitudes(): Observable<SolicitudVisitante[]> {
    return this.http.get<SolicitudVisitante[]>(this.apiUrl);
  }

  /** Actualiza el estado usando PUT como en Postman */
  actualizarEstadoSolicitud(id: number, estado: string): Observable<any> {
    // Enviamos el objeto { estado: "APROBADO" } que es lo que espera el Map en Java
    return this.http.put(`${this.apiUrl}/${id}/estado`, { estado: estado });
  }
}