import { Injectable, inject } from '@angular/core'; // Usamos inject que es más moderno
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definición del modelo (Si prefieres dejarlo aquí dentro)
export interface Reo {
  id: number;
  nombre: string;
  dni: string;
  delito: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReoService {
  private http = inject(HttpClient); // Forma moderna de inyectar
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/reos';

  // 1. Obtener todos
  getAllReos(): Observable<Reo[]> {
    return this.http.get<Reo[]>(this.apiUrl);
  }

  // 2. Obtener uno solo por ID
  getReoById(id: number | string): Observable<Reo> {
    return this.http.get<Reo>(`${this.apiUrl}/${id}`);
  }

  // 3. Crear nuevo
  createReo(reo: Reo): Observable<Reo> {
    return this.http.post<Reo>(this.apiUrl, reo);
  }

  // 4. Actualizar existente
  updateReo(id: number | string, reo: Reo): Observable<Reo> {
    return this.http.put<Reo>(`${this.apiUrl}/${id}`, reo);
  }

  // 5. Borrar
  deleteReo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}