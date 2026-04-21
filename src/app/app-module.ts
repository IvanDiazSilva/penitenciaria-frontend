import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// --- IMPORTACIONES ---
import { ReoListComponent } from './features/reos\\pages/reo-list/reo-list.component';
import { ReoFormComponent } from './features/reos\\pages/reo-form/reo-form.component';
import { PreregistroVisitanteComponent } from './features/visitantes/pages/preregistro/preregistro-visitante.component';
import { VisitasList } from './features/visitas/pages/visitas-list/visitas-list';
import { VisitasForm } from './features/visitas/pages/visitas-form/visitas-form';

@NgModule({
  declarations: [
    App,
    VisitasList,
    VisitasForm,
    // AQUÍ SOLO QUEDA "App". Los otros se han ido abajo.
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

    // --- ESTA ES LA LISTA MÁGICA ---
    // Como son Standalone (true), Angular exige que estén aquí:
    ReoListComponent,
    ReoFormComponent,
    PreregistroVisitanteComponent,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
