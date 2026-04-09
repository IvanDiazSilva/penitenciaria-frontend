// core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/penitenciaria-api/api';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    // Intentar recuperar token de sessionStorage al iniciar
    this.token = sessionStorage.getItem('auth_token');
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.token = response.token;
        sessionStorage.setItem('auth_token', response.token);
      })
    );
  }

  logout(): void {
    this.token = null;
    sessionStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.token !== null;
  }
}