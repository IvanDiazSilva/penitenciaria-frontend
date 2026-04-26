import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/auth/services/auth.services';
import {
  VisitantesService,
  EstadoVisitanteResponse
} from '../../services/visitantes.service';

@Component({
  selector: 'app-estado-visitante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-visitante.component.html',
  styleUrls: ['./estado-visitante.component.scss']
})
export class EstadoVisitanteComponent implements OnInit {
  visitante: EstadoVisitanteResponse | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private visitantesService: VisitantesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const username = this.authService.getUsername();

    if (!username) {
      this.errorMessage = 'No se pudo identificar al visitante autenticado.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.visitantesService.consultarEstadoPorDni(username).subscribe({
      next: (data) => {
        this.visitante = data;
        this.isLoading = false;
        console.log('Variable visitante asignada:', this.visitante);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'No se pudo consultar el estado del visitante.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getEstadoLabel(estado: string | undefined): string {
    switch (estado) {
      case 'APROBADO':
        return 'Aprobado';
      case 'DENEGADO':
        return 'Denegado';
      default:
        return 'Pendiente';
    }
  }

  getEstadoClass(estado: string | undefined): string {
    switch (estado) {
      case 'APROBADO':
        return 'estado-visitante__status estado-visitante__status--aprobado';
      case 'DENEGADO':
        return 'estado-visitante__status estado-visitante__status--denegado';
      default:
        return 'estado-visitante__status estado-visitante__status--pendiente';
    }
  }
}