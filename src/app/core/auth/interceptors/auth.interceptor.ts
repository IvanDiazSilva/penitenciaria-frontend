import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    console.log('INTERCEPTOR => URL:', req.url);
    console.log('INTERCEPTOR => TOKEN:', token);

    if (!token || req.url.includes('/login')) {
      return next.handle(req);
    }

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('INTERCEPTOR => AUTH HEADER AÑADIDO');

    return next.handle(authReq);
  }
}