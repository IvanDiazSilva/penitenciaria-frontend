import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-no-autorizado',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div style="text-align: center; padding: 2rem;">
      <h1>Acceso Denegado</h1>
      <p>No tienes los permisos necesarios para ver esta sección.</p>
      <a routerLink="/monitor">Volver al inicio</a>
    </div>
  `
})
export class NoAutorizadoComponent {}