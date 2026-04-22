import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/penitenciaria-api/api/monitor';

  getResumenMonitor(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getVisitasHoy(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/visitas-hoy`);
  }
}