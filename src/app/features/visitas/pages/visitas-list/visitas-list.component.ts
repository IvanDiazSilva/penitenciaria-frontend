import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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

  autorizandoIds = new Set<number>();

  private visitasService = inject(VisitasService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.rolActual = this.authService.getRol();

    this.esVisitante = this.rolActual === 'VISITANTE';
    this.esAdmin = this.rolActual === 'ADMIN';
    this.esGuardia = this.rolActual === 'GUARDIA';

    this.puedeCrear = this.esVisitante;
    this.puedeAutorizar = this.esAdmin;
    this.puedeEditarFlag = false;
    this.puedeEliminarFlag = this.esAdmin;
    this.mostrarAccionesFlag = this.esVisitante || this.esAdmin;

    this.obtenerVisitas();
  }

  obtenerVisitas(): void {
    this.loading = true;
    this.cdr.detectChanges();

    const request$ = this.esVisitante
      ? this.visitasService.getMisVisitas()
      : this.visitasService.getAllVisitas();

    request$.subscribe({
      next: (data) => {
        this.visitas = [...(data ?? [])];

        if (this.currentPage > Math.ceil((this.visitas.length || 1) / this.itemsPerPage)) {
          this.currentPage = 1;
        }

        this.actualizarPaginacion();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar visitas:', err);
        this.visitas = [];
        this.visitasPaginadas = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.visitas.length / this.itemsPerPage) || 1;
    this.paginas = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.visitasPaginadas = [...this.visitas.slice(start, start + this.itemsPerPage)];
  }

  irAPagina(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.actualizarPaginacion();
    this.cdr.detectChanges();
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.actualizarPaginacion();
      this.cdr.detectChanges();
    }
  }

  paginaSiguiente(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.actualizarPaginacion();
      this.cdr.detectChanges();
    }
  }

  irANuevaVisita(): void {
    if (!this.puedeCrear) return;
    this.router.navigate(['/visitante/solicitar-visita']);
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
          this.cdr.detectChanges();
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
    if (this.autorizandoIds.has(visita.id)) return;

    console.log('click autorizar', visita.id, visita.autorizado);

    this.autorizandoIds.add(visita.id);
    this.cdr.detectChanges();

    this.visitasService.autorizarVisita(visita.id).subscribe({
      next: () => {
        this.obtenerVisitas();
      },
      error: (err) => {
        console.error('Error al autorizar visita:', err);
        alert('No se pudo autorizar la visita');
        this.autorizandoIds.delete(visita.id!);
        this.cdr.detectChanges();
      },
      complete: () => {
        this.autorizandoIds.delete(visita.id!);
        this.cdr.detectChanges();
      }
    });
  }

  generarQr(visita: Visita): void {
    if (!visita.id || !this.esVisitante || !visita.autorizado) return;

    this.visitasService.generarQr(visita.id).subscribe({
      next: (res) => {
        visita.codigoQr = res.qr;
        this.verQr(visita);
        this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }

  cerrarQr(): void {
    this.visitaSeleccionada = null;
    this.qrSeleccionado = null;
    this.cdr.detectChanges();
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