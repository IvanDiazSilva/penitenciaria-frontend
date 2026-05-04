import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reo } from '../models/reo.model';

@Injectable({
  providedIn: 'root'
})
export class ReoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/reos';

  /**
   * 🔤 Formatea texto (Ej: "ROBO" → "Robo")
   */
  private formatearTexto(texto: string): string {
    if (!texto) return '';
    return texto.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * 🔍 OBTENER REO POR ID
   */
  getReoById(id: number | string): Observable<Reo> {
    console.log(`Consultando reo ID: ${id}`);
    return this.http.get<Reo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * ➕ ALTA RECLUSO
   */
  alta_recluso(reo: Reo): Observable<Reo> {
    const { id, ...datos } = reo;

    // Formateo antes de enviar
    if (datos.nombre) {
      datos.nombre = this.formatearTexto(datos.nombre);
    }

    if (datos.delito) {
      datos.delito = this.formatearTexto(datos.delito);
    }

    console.log('Insertando nuevo reo...', datos);

    return this.http.post<Reo>(this.apiUrl, datos).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * ✏️ MODIFICACIÓN RECLUSO
   */
  modificacion_recluso(id: number, reo: Reo): Observable<Reo> {

    if (reo.nombre) {
      reo.nombre = this.formatearTexto(reo.nombre);
    }

    if (reo.delito) {
      reo.delito = this.formatearTexto(reo.delito);
    }

    console.log(`Actualizando reo ID: ${id}`, reo);

    return this.http.put<Reo>(`${this.apiUrl}/${id}`, reo).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * ❌ BAJA RECLUSO
   */
  baja_recluso(id: number): Observable<any> {
    console.log(`Eliminando reo ID: ${id}`);

    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 📋 OBTENER TODOS
   */
  obtener_todos(): Observable<Reo[]> {
    console.log('Cargando lista de reos...');
    
    return this.http.get<Reo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * ⚠️ MANEJO DE ERRORES
   */
  private handleError(error: HttpErrorResponse) {

    let mensaje = 'Error en la operación de base de datos.';

    // DNI duplicado
    if (
      error.status === 409 ||
      (error.error && typeof error.error === 'string' && error.error.includes('reos_dni_key'))
    ) {
      mensaje = 'El DNI ya existe en la base de datos.';
    }

    // Foreign key (no borrar)
    else if (
      error.error &&
      typeof error.error === 'string' &&
      error.error.includes('violates foreign key constraint')
    ) {
      mensaje = 'No se puede eliminar: el reo tiene registros asociados.';
    }

    // No encontrado
    else if (error.status === 404) {
      mensaje = 'El registro no existe.';
    }

    // Error servidor
    else if (error.status === 500) {
      mensaje = 'Error interno del servidor.';
    }

    console.error('Error backend:', error);

    return throwError(() => new Error(mensaje));
  }
}