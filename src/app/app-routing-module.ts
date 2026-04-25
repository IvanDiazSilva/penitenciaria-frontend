import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './core/auth/pages/login-page/login.component';
import { MonitorPageComponent } from './features/monitor/pages/monitor-page/monitor-page.component';

import { VisitasListComponent } from './features/visitas/page/visitas-list/visitas-list.component';
import { VisitasFormComponent } from './features/visitas/page/visitas-form/visitas-form.component';

import { ReoListComponent } from './features/reos/pages/reo-list/reo-list.component';
import { ReoFormComponent } from './features/reos/pages/reo-form/reo-form.component';

import { PreregistroVisitanteComponent } from './features/visitantes/pages/preregistro-visitante/preregistro-visitante.component';
import { ValidacionVisitanteComponent } from './features/visitantes/pages/validacion-visitante/validacion-visitante.component';

import { InformesPageComponent } from './features/informes/pages/informes-page/informes-page.component';

import { AuthGuard } from './core/auth/guards/auth.guard';
import { AdminLayoutComponent } from './core/layout/pages/admin-layout/admin-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'preregistro', component: PreregistroVisitanteComponent },

  // Rutas protegidas
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'monitor', component: MonitorPageComponent },

      { path: 'reos', component: ReoListComponent },
      { path: 'reos/nuevo', component: ReoFormComponent },
      { path: 'reos/editar/:id', component: ReoFormComponent },

      { path: 'visitas', component: VisitasListComponent },
      { path: 'visitas/nueva', component: VisitasFormComponent },

      { path: 'informes', component: InformesPageComponent },

      { path: 'validacion-visitante', component: ValidacionVisitanteComponent },

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
