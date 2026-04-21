import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Para el router-outlet

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Componentes Standalone (Rutas corregidas)
import { ReoListComponent } from './features/reos/pages/reo-list/reo-list.component';
import { ReoFormComponent } from './features/reos/pages/reo-form/reo-form.component';
import { PreregistroVisitanteComponent } from './features/visitantes/pages/preregistro/preregistro-visitante.component';
import { VisitasListComponent } from './features/visitas/pages/visitas-list/visitas-list.component';
import { VisitasFormComponent } from './features/visitas/pages/visitas-form/visitas-form.component';

@NgModule({
  declarations: [
    App // Solo componentes NO standalone
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule, // <-- Soluciona el error NG8001

    // Standalone van en imports
    ReoListComponent,
    ReoFormComponent,
    PreregistroVisitanteComponent,
    VisitasListComponent,
    VisitasFormComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}