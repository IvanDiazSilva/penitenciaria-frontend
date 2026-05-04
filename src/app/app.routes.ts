import { Routes } from '@angular/router';

import { LoginComponent } from './core/auth/pages/login-page/login.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';

import { AdminLayoutComponent } from './core/layout/pages/admin-layout/admin-layout.component';

import { MonitorPageComponent } from './features/monitor/pages/monitor-page/monitor-page.component';
import { NoAutorizadoComponent } from './features/monitor/components/noAutorizadoComponent';

import { VisitasListComponent } from './features/visitas/pages/visitas-list/visitas-list.component';
import { VisitasFormComponent } from './features/visitas/pages/visitas-form/visitas-form.component';

import { ReoListComponent } from './features/reos/pages/reo-list/reo-list.component';
import { ReoFormComponent } from './features/reos/pages/reo-form/reo-form.component';
import { ValidacionVisitanteComponent } from './features/visitantes/pages/validacion/validacion-visitante.component';
import { PreregistroVisitanteComponent } from './features/visitantes/pages/preregistro/preregistro-visitante.component';

import { IncidenciaListComponent } from './features/incidentes/pages/incidente-list/incidencia-list.component';
import { IncidenciaFormComponent } from './features/incidentes/pages/incidente-form/incidencia-form.component';

import { ValidacionQrPageComponent } from './features/validacion-qr/pages/validacion-qr-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Rutas públicas
  { path: 'preregistro', component: PreregistroVisitanteComponent },
  { path: 'visitante/registro', redirectTo: 'preregistro', pathMatch: 'full' },
  { path: 'no-autorizado', component: NoAutorizadoComponent },

  // Zona admin / guardia
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
        path: 'incidentes',
        component: IncidenciaListComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'GUARDIA'] }
      },
      {
        path: 'incidentes/nuevo',
        component: IncidenciaFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'GUARDIA'] }
      },
      {
        path: 'validar-qr',
        component: ValidacionQrPageComponent,
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
        path: 'validacion-visitante',
        component: ValidacionVisitanteComponent,
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
        path: 'visitas/editar/:id',
        component: VisitasFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'GUARDIA'] }
      },
      { path: '', redirectTo: 'monitor', pathMatch: 'full' }
    ]
  },

  // Zona visitante autenticado
  {
    path: 'visitante',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['VISITANTE'] },
    children: [
      { path: '', redirectTo: 'mis-visitas', pathMatch: 'full' },
      {
        path: 'mis-visitas',
        component: VisitasListComponent,
        canActivate: [roleGuard],
        data: { roles: ['VISITANTE'] }
      },
      {
        path: 'solicitar-visita',
        component: VisitasFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['VISITANTE'] }
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];