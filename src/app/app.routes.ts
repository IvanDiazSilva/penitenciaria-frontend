import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login-page/login.component';
import { MonitorPageComponent } from './features/monitor/pages/monitor-page/monitor-page.component';
import { VisitasListComponent } from './features/visitas/page/visitas-list/visitas-list.component';
import { VisitasFormComponent } from './features/visitas/page/visitas-form/visitas-form.component';
import { ReoListComponent } from './features/reos/pages/reo-list/reo-list.component';
import { ReoFormComponent } from './features/reos/pages/reo-form/reo-form.component';
import { PreregistroVisitanteComponent } from './features/visitantes/pages/preregistro-visitante/preregistro-visitante.component';
import { ValidacionVisitanteComponent } from './features/visitantes/pages/validacion-visitante/validacion-visitante.component';
import { EstadoVisitanteComponent } from './features/visitantes/pages/estado-visitante/estado-visitante.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { AdminLayoutComponent } from './core/layout/pages/admin-layout/admin-layout.component';
import { NoAutorizadoComponent } from './features/monitor/components/noAutorizadoComponent';
import { VisitorLayoutComponent } from './core/layout/pages/visitor-layout/visitor-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'preregistro', component: PreregistroVisitanteComponent },
  { path: 'no-autorizado', component: NoAutorizadoComponent },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'monitor',
        component: MonitorPageComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'GUARDIA'] }
      },

      {
        path: 'reos',
        component: ReoListComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'GUARDIA'] }
      },
      {
        path: 'reos/nuevo',
        component: ReoFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'GUARDIA'] }
      },
      {
        path: 'reos/editar/:id',
        component: ReoFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'GUARDIA'] }
      },

      {
        path: 'visitas',
        component: VisitasListComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'GUARDIA'] }
      },
      {
        path: 'visitas/nueva',
        component: VisitasFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'GUARDIA'] }
      },
      {
        path: 'validacion-visitante',
        component: ValidacionVisitanteComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'GUARDIA'] }
      },

      { path: '', redirectTo: 'monitor', pathMatch: 'full' }
    ]
  },

  {
    path: 'visitante',
    component: VisitorLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['VISITANTE'] },
    children: [
      { path: '', redirectTo: 'estado', pathMatch: 'full' },
      {
        path: 'estado',
        component: EstadoVisitanteComponent,
        canActivate: [roleGuard],
        data: { roles: ['VISITANTE'] }
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];