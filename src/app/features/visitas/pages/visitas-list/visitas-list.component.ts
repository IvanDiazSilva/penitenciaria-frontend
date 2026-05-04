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
  loading = true;

  esVisitante = false;
  rolActual: string | null = null;

  currentPage = 1;
  itemsPerPage = 5;

  qrSeleccionado: string | null = null;
  visitaSeleccionada: Visita | null = null;

  private visitasService = inject(VisitasService);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.rolActual = this.authService.getRol();
    this.esVisitante = this.rolActual === 'VISITANTE';

    this.obtenerVisitas();
  }

  obtenerVisitas(): void {
    this.loading = true;

    const request$ = this.esVisitante
      ? this.visitasService.getMisVisitas()
      : this.visitasService.getAllVisitas();

    request$.subscribe({
      next: (data) => {
        console.log('Datos recibidos de la API:', data);
        this.visitas = data;
        this.currentPage = 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar visitas:', err);
        this.loading = false;
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.visitas.length / this.itemsPerPage) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get visitasPaginadas(): Visita[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.visitas.slice(start, end);
  }

  irAPagina(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  paginaSiguiente(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  irANuevaVisita(): void {
    if (this.esVisitante) {
      this.router.navigate(['/visitante/solicitar-visita']);
      return;
    }

    this.router.navigate(['/visitas/nueva']);
  }

  generarQr(visita: Visita): void {
    if (!visita.id || !this.esVisitante || !visita.autorizado) {
      return;
    }

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
    if (!visita.codigoQr) {
      return;
    }

    this.visitaSeleccionada = visita;
    this.qrSeleccionado = visita.codigoQr;
  }

  cerrarQr(): void {
    this.visitaSeleccionada = null;
    this.qrSeleccionado = null;
  }

  eliminar(id: number): void {
    if (!this.puedeEliminar()) {
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta solicitud de visita?')) {
      this.visitasService.deleteVisita(id).subscribe({
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
    if (!this.puedeEditar(visita) || !visita.id) {
    this.router.navigate(['/visitas/editar', visita.id]);
  }

  mostrarAcciones(): boolean {
  }

  puedeCrearVisita(): boolean {
    return (
      this.rolActual === 'ADMIN' ||
      this.rolActual === 'GUARDIA' ||
      this.rolActual === 'VISITANTE'
    );
  }

  puedeEditar(_visita: Visita): boolean {
    return this.rolActual === 'ADMIN' || this.rolActual === 'GUARDIA';
  }

  puedeEliminar(): boolean {
    return this.rolActual === 'ADMIN';
  }
}