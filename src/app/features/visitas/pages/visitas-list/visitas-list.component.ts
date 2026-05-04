import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VisitaService } from '../../services/visitas.service';
import { Visita } from '../../models/visita.model';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-visitas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitas-list.component.html',
  styleUrls: ['./visitas-list.component.scss']
})
export class VisitasListComponent implements OnInit {
  visitas: Visita[] = [];
  loading = true;

  esVisitante = false;
  rolActual: string | null = null;

  private visitaService = inject(VisitaService);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.rolActual = this.authService.getRol();
    this.esVisitante = this.rolActual === 'VISITANTE' || this.router.url.startsWith('/visitante');

    this.obtenerVisitas();
  }

  obtenerVisitas(): void {
    this.loading = true;

    const request$ = this.esVisitante
      ? this.visitaService.getMisVisitas()
      : this.visitaService.getAllVisitas();

    request$.subscribe({
      next: (data) => {
        this.visitas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar visitas:', err);
        this.loading = false;
      }
    });
  }

  irANuevaVisita(): void {
    if (this.esVisitante) {
      this.router.navigate(['/visitante/solicitar-visita']);
      return;
    }

    this.router.navigate(['/visitas/nueva']);
  }

  eliminar(id: number): void {
    if (!this.puedeEliminar()) {
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta solicitud de visita?')) {
      this.visitaService.deleteVisita(id).subscribe({
        next: () => {
          this.obtenerVisitas();
        },
        error: (err) => {
          console.error('No se pudo eliminar la visita', err);
          alert('No se pudo eliminar la visita');
        }
      });
    }
  }

  editar(visita: Visita): void {
    if (!this.puedeEditar(visita)) {
      return;
    }

    if (this.esVisitante) {
      this.router.navigate(['/visitante/mis-visitas']);
      return;
    }

    this.router.navigate(['/visitas/editar', visita.id]);
  }

  mostrarAcciones(): boolean {
    return this.rolActual === 'ADMIN' || this.rolActual === 'GUARDIA';
  }

  puedeCrearVisita(): boolean {
    return this.rolActual === 'ADMIN' || this.rolActual === 'GUARDIA' || this.rolActual === 'VISITANTE';
  }

  puedeEditar(_visita: Visita): boolean {
    return this.rolActual === 'ADMIN' || this.rolActual === 'GUARDIA';
  }

  puedeEliminar(): boolean {
    return this.rolActual === 'ADMIN';
  }
}