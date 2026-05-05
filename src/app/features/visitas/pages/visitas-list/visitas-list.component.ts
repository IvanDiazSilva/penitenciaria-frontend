import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';

import { VisitasService } from '../../services/visitas.service';
import { Visita } from '../../models/visita.model';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-visitas-list',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './visitas-list.component.html',
  styleUrls: ['./visitas-list.component.scss']
})
export class VisitasListComponent implements OnInit {

  visitas: Visita[] = [];
  visitasPaginadas: Visita[] = [];

  loading = true;

  rolActual: string | null = null;
  esVisitante = false;
  esAdmin = false;
  esGuardia = false;

  puedeCrear = false;
  puedeAutorizar = false;
  puedeEditarFlag = false;
  puedeEliminarFlag = false;
  mostrarAccionesFlag = false;

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  paginas: number[] = [];

  qrSeleccionado: string | null = null;
  visitaSeleccionada: Visita | null = null;

  private visitasService = inject(VisitasService);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.rolActual = this.authService.getRol();

    this.esVisitante = this.rolActual === 'VISITANTE';
    this.esAdmin = this.rolActual === 'ADMIN';
    this.esGuardia = this.rolActual === 'GUARDIA';

    this.puedeCrear = this.esVisitante;
    this.puedeAutorizar = this.esAdmin;
    this.puedeEditarFlag = this.esAdmin;
    this.puedeEliminarFlag = this.esAdmin;
    this.mostrarAccionesFlag =
      this.esVisitante || this.esAdmin || this.esGuardia;

    this.obtenerVisitas();
  }

  obtenerVisitas(): void {
    this.loading = true;

    const request$ = this.esVisitante
      ? this.visitasService.getMisVisitas()
      : this.visitasService.getAllVisitas();

    request$.subscribe({
      next: (data) => {
        this.visitas = data ?? [];
        this.currentPage = 1;
        this.actualizarPaginacion();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar visitas:', err);
        this.visitas = [];
        this.visitasPaginadas = [];
        this.loading = false;
      }
    });
  }

  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.visitas.length / this.itemsPerPage) || 1;

    this.paginas = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.visitasPaginadas = this.visitas.slice(start, start + this.itemsPerPage);
  }

  irAPagina(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.actualizarPaginacion();
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.actualizarPaginacion();
    }
  }

  irANuevaVisita(): void {
    if (!this.puedeCrear) return;
    this.router.navigate(['/visitante/solicitar-visita']);
  }

  editar(visita: Visita): void {
    if (!this.puedeEditarFlag || !visita.id) return;
    this.router.navigate(['/visitas/editar', visita.id]);
  }

  eliminar(id: number): void {
    if (!this.puedeEliminarFlag) return;

    if (confirm('¿Eliminar esta visita?')) {
      this.visitasService.deleteVisita(id).subscribe({
        next: () => {
          this.visitas = this.visitas.filter(v => v.id !== id);

          if ((this.currentPage - 1) * this.itemsPerPage >= this.visitas.length && this.currentPage > 1) {
            this.currentPage--;
          }

          this.actualizarPaginacion();
        },
        error: (err) => {
          console.error('Error al eliminar visita:', err);
          alert('No se pudo eliminar la visita');
        }
      });
    }
  }

  autorizar(visita: Visita): void {
    if (!this.puedeAutorizar || !visita.id || visita.autorizado) return;

    this.visitasService.autorizarVisita(visita.id).subscribe({
      next: () => {
        visita.autorizado = true;
        this.actualizarPaginacion();
      },
      error: (err) => {
        console.error('Error al autorizar visita:', err);
        alert('No se pudo autorizar la visita');
      }
    });
  }

  generarQr(visita: Visita): void {
    if (!visita.id || !this.esVisitante || !visita.autorizado) return;

    this.visitasService.generarQr(visita.id).subscribe({
      next: (res) => {
        visita.codigoQr = res.qr;
        this.verQr(visita);
      },
      error: (err) => {
        console.error('Error al generar QR:', err);
        alert('No se pudo generar el QR');
      }
    });
  }

  verQr(visita: Visita): void {
    if (!visita.codigoQr) return;

    this.visitaSeleccionada = visita;
    this.qrSeleccionado = visita.codigoQr;
  }

  cerrarQr(): void {
    this.visitaSeleccionada = null;
    this.qrSeleccionado = null;
  }

  puedeGenerarQr(visita: Visita): boolean {
    return this.esVisitante && !!visita.id && !!visita.autorizado;
  }

  puedeVerQr(visita: Visita): boolean {
    return this.esVisitante && !!visita.codigoQr;
  }

  puedeAutorizarVisita(visita: Visita): boolean {
    return this.esAdmin && !!visita.id && !visita.autorizado;
  }

  trackByVisitaId(index: number, visita: Visita): number {
    return visita.id ?? index;
  }
}