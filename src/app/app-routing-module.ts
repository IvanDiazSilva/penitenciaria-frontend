import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { MonitorComponent } from './features/monitor/monitor.component';
import { VisitasComponent } from './features/visitas/visitas.component';
import { ReoListComponent } from './features/reos/reo-list.component';
import { AuthGuard } from './core/auth/services/auth.guard';
import { PreregistroVisitanteComponent } from './features/visitantes/pages/preregistro/preregistro-visitante.component';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'preregistro', component: PreregistroVisitanteComponent },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'monitor', component: MonitorComponent },
      { path: 'reos', component: ReoListComponent },
      { path: 'visitas', component: VisitasComponent },
      { path: '', redirectTo: 'monitor', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }