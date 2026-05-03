import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login-page/login.component';
import { MonitorPageComponent } from './features/monitor/pages/monitor-page/monitor-page.component';
import { VisitasListComponent } from './features/visitas/pages/visitas-list/visitas-list.component';
import { VisitasFormComponent } from './features/visitas/pages/visitas-form/visitas-form.component';
import { ReoListComponent } from './features/reos/pages/reo-list/reo-list.component';
import { PreregistroVisitanteComponent } from './features/visitantes/pages/preregistro/preregistro-visitante.component';
import { ValidacionVisitanteComponent } from './features/validacion-visitante/pages/validacion-form/validacion-visitante.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { AdminLayoutComponent } from './core/layout/pages/admin-layout/admin-layout.component';
import { NoAutorizadoComponent } from './features/monitor/components/noAutorizadoComponent';
import { VisitorLayoutComponent } from './core/layout/pages/visitor-layout/visitor-layout.component';
import { IncidenciaListComponent } from './features/incidentes/pages/incidente-list/incidencia-list.component';
import { ValidacionQrPageComponent } from './features/validacion-qr/pages/validacion-qr-page.component';
import { IncidenciaFormComponent } from './features/incidentes/pages/incidente-form/incidencia-form.component';

// Y en el array de rutas:
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'visitante/registro', 
    component: PreregistroVisitanteComponent // El componente de visitantes que ya tenías
  },
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
  path: 'incidentes',
  component: IncidenciaListComponent,
  canActivate: [roleGuard],
  data: { roles: ['ADMIN', 'GUARDIA'] }
},
{
      path: 'incidentes/nuevo', // O el nombre que quieras usar
      component: IncidenciaFormComponent, // <--- Pon aquí tu componente de formulario
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
        path: 'validacion-visitas',
        component: ValidacionVisitanteComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
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
      // Al entrar a /visitante, redirigimos automáticamente a sus visitas
      { path: '', redirectTo: 'mis-visitas', pathMatch: 'full' },
      { 
        path: 'mis-visitas', 
        component: VisitasListComponent,
        canActivate: [roleGuard],
        data: { roles: ['VISITANTE'] }
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];