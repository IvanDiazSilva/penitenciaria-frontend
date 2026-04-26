import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { MonitorComponent } from './features/monitor/pages/monitor-dashboard/monitor.component';

// Visitas
import { VisitasListComponent } from './features/visitas/pages/visitas-list/visitas-list.component';
import { VisitasFormComponent } from './features/visitas/pages/visitas-form/visitas-form.component';

// Reos
import { ReoListComponent } from './features/reos/pages/reo-list/reo-list.component';
import { ReoFormComponent } from './features/reos/pages/reo-form/reo-form.component';

// Incidentes
import { IncidenciaFormComponent } from './features/incidentes/pages/incidente-form/incidencia-form.component';
import { IncidenciaListComponent } from './features/incidentes/pages/incidente-list/incidencia-list.component';

// Seguridad y Otros
import { AuthGuard } from './core/guards/auth.guard';
import { PreregistroVisitanteComponent } from './features/visitantes/pages/preregistro/preregistro-visitante.component';
import { ValidacionVisitanteComponent } from './features/validacion-visitante/pages/validacion-form/validacion-visitante.component';

const routes: Routes = [
  // Redirección inicial
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Rutas de Reos protegidas
  { path: 'reos', component: ReoListComponent, canActivate: [AuthGuard] },
  { path: 'reos/nuevo', component: ReoFormComponent, canActivate: [AuthGuard] }, 
  { path: 'reos/editar/:id', component: ReoFormComponent, canActivate: [AuthGuard] },
  
  // Rutas de Visitas protegidas
  { path: 'visitas', component: VisitasListComponent, canActivate: [AuthGuard] },
  { path: 'visitas/nueva', component: VisitasFormComponent, canActivate: [AuthGuard] },
  
  // Dashboard y Validación protegidos
  { path: 'monitor', component: MonitorComponent, canActivate: [AuthGuard] },
  { path: 'validacion-visitante', component: ValidacionVisitanteComponent, canActivate: [AuthGuard] },
  
  // Rutas de Incidencias PROTEGIDAS (Añadido canActivate)
  { path: 'incidencias', component: IncidenciaListComponent, canActivate: [AuthGuard] },
  { path: 'incidencias/nuevo', component: IncidenciaFormComponent, canActivate: [AuthGuard] },
  { path: 'incidencias/editar/:id', component: IncidenciaFormComponent, canActivate: [AuthGuard] },
  
  // Rutas públicas o especiales
  { path: 'portal-visitante', component: PreregistroVisitanteComponent },
  
  // Comodín para rutas no encontradas
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }