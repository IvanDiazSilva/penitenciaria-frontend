import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reo } from '../models/reo.model';

@Injectable({
  providedIn: 'root'
})

export class ReoService {
  // Inyección de HttpClient para realizar peticiones asíncronas al servidor
  private http = inject(HttpClient);
  
  // URL del endpoint de la API que conecta con nuestra base de datos SQL
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/reos';

  /**
   * CASO DE USO: OBTENER POR ID
   * Este es el método que faltaba. Lo usa el formulario para editar.
   */
  getReoById(id: number | string): Observable<Reo> {
    console.log(`Consultando registro específico ID: ${id}`);
    return this.http.get<Reo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  /**
   * CASO DE USO: ALTA RECLUSO
   * Envía un comando POST para insertar una nueva fila en la tabla 'reos'.
   */
  alta_recluso(reo: Reo): Observable<Reo> {
    // DESESTRUCTURACIÓN: Extraemos el ID para no enviarlo.
    // La Base de Datos se encarga de generarlo (AUTO_INCREMENT / SERIAL).
    const { id, ...datosParaInsertar } = reo;
    
    console.log('Iniciando transacción de alta en la BD...');
    return this.http.post<Reo>(this.apiUrl, datosParaInsertar).pipe(
      catchError(this.handleError) // Captura errores de validación de la BD
    );
  }

  /**
   * CASO DE USO: MODIFICACIÓN RECLUSO
   * Envía un comando PUT para actualizar una fila específica identificada por su Primary Key (ID).
   */
  modificacion_recluso(id: number, reo: Reo): Observable<Reo> {
    console.log(`Sincronizando cambios para el reo con ID: ${id}`);
    // Se concatena el ID en la URL para que el Backend sepa qué registro editar
    return this.http.put<Reo>(`${this.apiUrl}/${id}`, reo).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * CASO DE USO: BAJA RECLUSO
   * Envía un comando DELETE para eliminar físicamente el registro de la base de datos.
   */
  baja_recluso(id: number): Observable<any> {
    console.log(`Solicitando eliminación del registro ID: ${id}`);
    // La petición DELETE viaja hacia la Primary Key en el servidor
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Crucial para detectar si hay restricciones de integridad (Foreign Keys)
    );
  }

  /**
   * MÉTODO DE APOYO: OBTENER TODOS
   * Realiza una consulta SELECT a la base de datos y mapea el resultado a nuestro modelo Reo[].
   */
  obtener_todos(): Observable<Reo[]> {
    return this.http.get<Reo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * GESTOR DE ERRORES DE CONEXIÓN Y REGLAS DE NEGOCIO
   * Aquí es donde Angular "escucha" lo que la Base de Datos tiene que decir.
   */
  private handleError(error: HttpErrorResponse) {
    let mensajeParaUsuario = 'Error en la operación de base de datos.';

    // 1. Error de Unicidad (DNI duplicado): La BD rechaza el insert/update
    if (error.status === 409 || (error.error && error.error.includes('reos_dni_key'))) {
      mensajeParaUsuario = 'Violación de Integridad: El DNI introducido ya existe en la base de datos.';
    } 
    
    // 2. Error de Integridad Referencial (Foreign Key): No se puede borrar si tiene datos asociados
    else if (error.error && error.error.includes('violates foreign key constraint')) {
      mensajeParaUsuario = 'Restricción de Borrado: El recluso tiene incidentes registrados que impiden su eliminación.';
    }

    // 3. Error de Recurso no encontrado: El ID ya no existe en la tabla
    else if (error.status === 404) {
      mensajeParaUsuario = 'Error: El registro solicitado no existe en la base de datos.';
    }

    // 4. Error de Servidor: Caída de la base de datos o fallo en el Backend
    else if (error.status === 500) {
      mensajeParaUsuario = 'Fallo crítico: El servidor de la base de datos no responde correctamente.';
    }

    // Devolvemos el error "masticado" para que el componente lo muestre en un alert o un toast
    return throwError(() => new Error(mensajeParaUsuario));
  }
}