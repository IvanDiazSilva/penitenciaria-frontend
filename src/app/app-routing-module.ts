import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { MonitorComponent } from './features/monitor/pages/monitor-dashboard/monitor.component';// Importaciones de Visitas corregidas
import { VisitasListComponent } from './features/visitas/pages/visitas-list/visitas-list.component';
import { VisitasFormComponent } from './features/visitas/pages/visitas-form/visitas-form';
// Importaciones de Reos corregidas (con /)
import { ReoListComponent } from './features/reos/pages/reo-list/reo-list.component';
import { ReoFormComponent } from './features/reos/pages/reo-form/reo-form.component'; 

import { AuthGuard } from './core/guards/auth.guard';
import { PreregistroVisitanteComponent } from './features/visitantes/pages/preregistro/preregistro-visitante.component';
import { ValidacionVisitanteComponent } from './features/validacion-visitante/pages/validacion-form/validacion-visitante.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Rutas de Reos
  { path: 'reos', component: ReoListComponent, canActivate: [AuthGuard] },
  { path: 'reos/nuevo', component: ReoFormComponent, canActivate: [AuthGuard] }, 
  { path: 'reos/editar/:id', component: ReoFormComponent, canActivate: [AuthGuard] },
  
  // Rutas de Visitas (¡ESTO ES LO QUE HABÍA QUE CAMBIAR!)
  { path: 'visitas', component: VisitasListComponent, canActivate: [AuthGuard] },
  { path: 'visitas/nueva', component: VisitasFormComponent, canActivate: [AuthGuard] },
  
  { path: 'monitor', component: MonitorComponent, canActivate: [AuthGuard] },
  { path: 'validacion-visitante', component: ValidacionVisitanteComponent, canActivate: [AuthGuard] },
  { path: 'portal-visitante', component: PreregistroVisitanteComponent },
  
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }