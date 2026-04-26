import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router'; // 1. Importa esto
import { provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './app/core/auth/interceptors/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './app/app.routes'; // 2. Importa tus rutas
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes), // 3. Añade el router aquí
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule
    ),
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));