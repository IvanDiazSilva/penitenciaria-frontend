import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Incidente } from '../models/incidente.models';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/incidentes';

  /**
   * 🔹 OBTENER TODOS
   */
  obtener_todos(): Observable<Incidente[]> {
    console.log('Consultando listado completo de incidencias...');
    return this.http.get<Incidente[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 🔹 OBTENER POR ID
   */
  getIncidenciaById(id: number | string): Observable<Incidente> {
    console.log(`Consultando incidencia ID: ${id}`);
    return this.http.get<Incidente>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 🔹 ALTA
   */
  alta_incidente(incidencia: Incidente): Observable<Incidente> {
    const { id, ...datos } = incidencia;

    console.log('Insertando nueva incidencia...');
    return this.http.post<Incidente>(this.apiUrl, datos).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 🔹 MODIFICACIÓN
   */
  modificacion_incidente(id: number, incidencia: Incidente): Observable<Incidente> {
    console.log(`Actualizando incidencia ID: ${id}`);
    return this.http.put<Incidente>(`${this.apiUrl}/${id}`, incidencia).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 🔹 ELIMINAR
   */
  baja_incidente(id: number): Observable<any> {
    console.log(`Eliminando incidencia ID: ${id}`);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 🔹 MANEJO DE ERRORES
   */
  private handleError(error: HttpErrorResponse) {
    let mensaje = 'Error en la gestión de incidencias.';

    if (error.status === 400) {
      mensaje = 'Error de validación: revisa los datos introducidos.';
    } 
    else if (error.status === 404) {
      mensaje = 'La incidencia no existe o fue eliminada.';
    } 
    else if (error.status === 500) {
      mensaje = 'Error interno del servidor.';
    } 
    else if (error.error && typeof error.error === 'string' && error.error.includes('foreign key')) {
      mensaje = 'Error de integridad: el reo o guardia no es válido.';
    }

    console.error('ERROR BACKEND:', error);
    return throwError(() => new Error(mensaje));
  }
}