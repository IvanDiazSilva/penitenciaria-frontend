import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { AuthInterceptor } from './app/core/auth/interceptors/auth.interceptor';
import { routes } from './app/app.routes';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule
    ),
    provideBrowserGlobalErrorListeners(),
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));