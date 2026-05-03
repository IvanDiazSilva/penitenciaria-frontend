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
   * Función privada de utilidad para capitalizar textos.
   * Transforma "ROBO CON FUERZA" en "Robo Con Fuerza".
   */
  private formatearTexto(texto: string): string {
    if (!texto) return '';
    return texto.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  getReoById(id: number | string): Observable<Reo> {
    return this.http.get<Reo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * CASO DE USO: ALTA RECLUSO
   */
  alta_recluso(reo: Reo): Observable<Reo> {
    const { id, ...datosParaInsertar } = reo;
    
    // Formateamos Nombre y Delito antes de enviar a la BD
    if (datosParaInsertar.nombre) {
      datosParaInsertar.nombre = this.formatearTexto(datosParaInsertar.nombre);
    }
    
    if (datosParaInsertar.delito) {
      datosParaInsertar.delito = this.formatearTexto(datosParaInsertar.delito);
    }

    console.log('Insertando registro con campos formateados...');
    return this.http.post<Reo>(this.apiUrl, datosParaInsertar).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * CASO DE USO: MODIFICACIÓN RECLUSO
   */
  modificacion_recluso(id: number, reo: Reo): Observable<Reo> {
    // Formateamos antes de la actualización
    if (reo.nombre) {
      reo.nombre = this.formatearTexto(reo.nombre);
    }

    if (reo.delito) {
      reo.delito = this.formatearTexto(reo.delito);
    }

    return this.http.put<Reo>(`${this.apiUrl}/${id}`, reo).pipe(
      catchError(this.handleError)
    );
  }

  baja_recluso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  obtener_todos(): Observable<Reo[]> {
    return this.http.get<Reo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let mensajeParaUsuario = 'Error en la operación de base de datos.';

    if (error.status === 409 || (error.error && typeof error.error === 'string' && error.error.includes('reos_dni_key'))) {
      mensajeParaUsuario = 'Violación de Integridad: El DNI introducido ya existe en la base de datos.';
    } 
    else if (error.error && typeof error.error === 'string' && error.error.includes('violates foreign key constraint')) {
      mensajeParaUsuario = 'Restricción de Borrado: El recluso tiene incidentes registrados que impiden su eliminación.';
    }
    else if (error.status === 404) {
      mensajeParaUsuario = 'Error: El registro solicitado no existe en la base de datos.';
    }
    else if (error.status === 500) {
      mensajeParaUsuario = 'Fallo crítico: El servidor de la base de datos no responde correctamente.';
    }

    return throwError(() => new Error(mensajeParaUsuario));
  }
}