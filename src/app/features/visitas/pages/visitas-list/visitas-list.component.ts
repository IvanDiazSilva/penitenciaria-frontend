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

  esVisitante = false;
  rolActual: string | null = null;

  // 🔥 FLAGS PRECALCULADOS
  puedeCrear = false;
  puedeEditarFlag = false;
  puedeEliminarFlag = false;
  mostrarAccionesFlag = false;

  // 📄 PAGINACIÓN
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  paginas: number[] = [];

  // 🔳 QR
  qrSeleccionado: string | null = null;
  visitaSeleccionada: Visita | null = null;

  private visitasService = inject(VisitasService);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.rolActual = this.authService.getRol();
    this.esVisitante = this.rolActual === 'VISITANTE';

    // 🔥 FLAGS (NO funciones en HTML)
    this.puedeCrear = ['ADMIN', 'GUARDIA', 'VISITANTE'].includes(this.rolActual || '');
    this.puedeEditarFlag = ['ADMIN', 'GUARDIA'].includes(this.rolActual || '');
    this.puedeEliminarFlag = this.rolActual === 'ADMIN';
    this.mostrarAccionesFlag = this.puedeEditarFlag || this.puedeEliminarFlag;

    this.obtenerVisitas();
  }

  obtenerVisitas(): void {
    this.loading = true;

    const request$ = this.esVisitante
      ? this.visitasService.getMisVisitas()
      : this.visitasService.getAllVisitas();

    request$.subscribe({
      next: (data) => {
        this.visitas = data;
        this.currentPage = 1;

        this.actualizarPaginacion();

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar visitas:', err);
        this.loading = false;
      }
    });
  }

  // 📄 PAGINACIÓN OPTIMIZADA
  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.visitas.length / this.itemsPerPage) || 1;

    this.paginas = Array.from({ length: this.totalPages }, (_, i) => i + 1);

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

  // ➕ CREAR
  irANuevaVisita(): void {
    if (this.esVisitante) {
      this.router.navigate(['/visitante/solicitar-visita']);
    } else {
      this.router.navigate(['/visitas/nueva']);
    }
  }

  // ✏️ EDITAR
  editar(visita: Visita): void {
    if (!this.puedeEditarFlag || !visita.id) return;

    this.router.navigate(['/visitas/editar', visita.id]);
  }

  // ❌ ELIMINAR
  eliminar(id: number): void {
    if (!this.puedeEliminarFlag) return;

    if (confirm('¿Eliminar esta visita?')) {
      this.visitasService.deleteVisita(id).subscribe({
        next: () => this.obtenerVisitas(),
        error: () => alert('No se pudo eliminar')
      });
    }
  }

  // 🔳 QR
  generarQr(visita: Visita): void {
    if (!visita.id || !this.esVisitante || !visita.autorizado) return;

    this.visitasService.generarQr(visita.id).subscribe({
      next: (res) => {
        visita.codigoQr = res.qr;
        this.verQr(visita);
      },
      error: () => alert('No se pudo generar el QR')
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
}