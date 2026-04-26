import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  username: string;
  mensaje: string;
  rol: string;
}

export interface AuthUser {
  username: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem(this.TOKEN_KEY)
  );

  private userSubject = new BehaviorSubject<AuthUser | null>(
    this.getStoredUser()
  );

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'http://localhost:8080/penitenciaria-api/api/login',
      credentials
    ).pipe(
      tap((response) => {
        if (response.token) {
          const user: AuthUser = {
            username: response.username,
            rol: response.rol
          };

          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));

          this.tokenSubject.next(response.token);
          this.userSubject.next(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.tokenSubject.next(null);
    this.userSubject.next(null);

    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSubject.value || localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    return this.userSubject.value || this.getStoredUser();
  }

  getCurrentUser(): AuthUser | null {
    return this.getUser();
  }

  getUsername(): string | null {
    return this.getUser()?.username ?? null;
  }

  getRol(): string | null {
    return this.getUser()?.rol ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  hasRole(roles: string[]): boolean {
    const rol = this.getRol();
    return !!rol && roles.includes(rol);
  }

  private getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}