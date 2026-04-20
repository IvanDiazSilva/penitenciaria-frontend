import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { MonitorComponent } from './features/monitor/monitor.component';
import { VisitasComponent } from './features/visitas/visitas.component';
import { ReoListComponent } from './features/reos\\pages/reo-list/reo-list.component';
// 1. IMPORTA AQUÍ EL FORMULARIO
import { ReoFormComponent } from './features/reos\\pages/reo-form/reo-form.component'; 
import { AuthGuard } from './core/guards/auth.guard';
import { PreregistroVisitanteComponent } from './features/visitantes/pages/preregistro/preregistro-visitante.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'reos', component: ReoListComponent, canActivate: [AuthGuard] },
  
  // 2. AÑADE ESTA RUTA AQUÍ:
  { path: 'reos/nuevo', component: ReoFormComponent, canActivate: [AuthGuard] }, 
  
  { path: 'visitas', component: VisitasComponent, canActivate: [AuthGuard] },
  { path: 'monitor', component: MonitorComponent, canActivate: [AuthGuard] },
  { path: 'portal-visitante', component: PreregistroVisitanteComponent }, 
  
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }