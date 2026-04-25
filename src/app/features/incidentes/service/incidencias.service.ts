import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Incidente } from '../models/incidente.models';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {
  // Inyección de HttpClient para la comunicación con el Backend
  private http = inject(HttpClient);
  
  // URL del endpoint para la tabla 'incidentes'
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/incidentes';

  /**
   * CASO DE USO: CONSULTAR INCIDENTE POR ID
   */
  getIncidenciaById(id: number | string): Observable<Incidente> {
    console.log(`Consultando reporte específico ID: ${id}`);
    return this.http.get<Incidente>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * CASO DE USO: ALTA INCIDENTE
   * Registra un nuevo evento. Se aplica desestructuración para que el ID lo maneje la BD.
   */
  alta_incidente(incidencia: Incidente): Observable<Incidente> {
    const { id, ...datosParaInsertar } = incidencia;
    
    console.log('Insertando nueva incidencia en la base de datos...');
    return this.http.post<Incidente>(this.apiUrl, datosParaInsertar).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * CASO DE USO: MODIFICACIÓN INCIDENTE
   * Actualiza la información de un reporte existente.
   */
  modificacion_incidente(id: number, incidencia: Incidente): Observable<Incidente> {
    console.log(`Sincronizando actualización del incidente ID: ${id}`);
    return this.http.put<Incidente>(`${this.apiUrl}/${id}`, incidencia).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * CASO DE USO: BAJA INCIDENTE
   * Elimina el registro del historial.
   */
  baja_incidente(id: number): Observable<any> {
    console.log(`Solicitando borrado físico del incidente ID: ${id}`);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * MÉTODO DE APOYO: OBTENER TODOS
   */
  obtener_todos(): Observable<Incidente[]> {
    return this.http.get<Incidente[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * GESTOR DE ERRORES DE CONEXIÓN Y REGLAS DE NEGOCIO (DB)
   * Adaptado específicamente para la lógica de incidentes.
   */
  private handleError(error: HttpErrorResponse) {
    let mensajeParaUsuario = 'Error en la operación de gestión de incidencias.';

    // 1. Error de Integridad Referencial (Foreign Key con Reos)
    if (error.error && error.error.includes('violates foreign key constraint')) {
      // Esto pasa si intentamos poner un id_reo que no existe o borrar un guardia asociado
      mensajeParaUsuario = 'Violación de Integridad: El recluso indicado no existe o el registro está bloqueado por otra tabla.';
    } 
    
    // 2. Error de Datos Nulos o inválidos (Check constraints en la DB)
    else if (error.status === 400) {
      mensajeParaUsuario = 'Error de validación: Compruebe que todos los campos obligatorios (tipo, reo, guardia) son correctos.';
    }

    // 3. Error de Recurso no encontrado
    else if (error.status === 404) {
      mensajeParaUsuario = 'Error: El incidente seleccionado ya no existe en la base de datos.';
    }

    // 4. Fallo crítico del servidor o base de datos caída
    else if (error.status === 500) {
      mensajeParaUsuario = 'Fallo crítico: El servidor penitenciario no responde. Contacte con soporte técnico.';
    }

    // Retornamos el error para que el componente lo capture en el suscribe
    return throwError(() => new Error(mensajeParaUsuario));
  }
}