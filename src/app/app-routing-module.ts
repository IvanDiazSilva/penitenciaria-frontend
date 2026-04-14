import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { MonitorComponent } from './features/monitor/monitor.component';
import { VisitasComponent } from './features/visitas/visitas.component';
import { ReoListComponent } from './features/reos/reo-list.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'reos', component: ReoListComponent, canActivate: [AuthGuard] },
  { path: 'visitas', component: VisitasComponent, canActivate: [AuthGuard] },
  { path: 'monitor', component: MonitorComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }