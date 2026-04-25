import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { MonitorService } from '../../services/monitor.service';
import {
  MonitorStats,
  MonitorVisitasHoy,
  MonitorInforme,
  MonitorInformeFiltros,
  ReoOption
} from '../../models/monitor-resumen.model';

import { MonitorStatsComponent } from '../../components/monitor-stats/monitor-stats.component';
import { MonitorVisitasHoyComponent } from '../../components/monitor-visitas-hoy/monitor-visitas-hoy.component';
import { MonitorFiltrosComponent } from '../../components/monitor-filtros/monitor-filtros.component';
import { MonitorInformeComponent } from '../../components/monitor-informe/monitor-informe.component';

@Component({
  selector: 'app-monitor-page',
  standalone: true,
  imports: [
    CommonModule,
    MonitorStatsComponent,
    MonitorVisitasHoyComponent,
    MonitorFiltrosComponent,
    MonitorInformeComponent
  ],
  templateUrl: './monitor-page.component.html',
  styleUrls: ['./monitor-page.component.scss']
})
export class MonitorPageComponent implements OnInit {
  stats: MonitorStats | null = null;
  visitasHoy: MonitorVisitasHoy | null = null;
  informe: MonitorInforme | null = null;
  reos: ReoOption[] = [];

  loadingStats = false;
  loadingVisitasHoy = false;
  loadingInforme = false;
  loadingReos = false;
  downloadingPdf = false;

  errorStats = '';
  errorVisitasHoy = '';
  errorInforme = '';
  errorReos = '';

  filtros: MonitorInformeFiltros = {
    reoId: null,
    fechaDesde: null,
    fechaHasta: null
  };

  constructor(private monitorService: MonitorService) {}

  ngOnInit(): void {
    this.cargarStats();
    this.cargarVisitasHoy();
    this.cargarReos();
    this.cargarInforme();
  }

  cargarStats(): void {
    this.loadingStats = true;
    this.errorStats = '';

    this.monitorService.obtenerStats()
      .pipe(finalize(() => this.loadingStats = false))
      .subscribe({
        next: (data) => {
          this.stats = data;
        },
        error: () => {
          this.errorStats = 'No se pudieron cargar las estadísticas.';
          this.stats = null;
        }
      });
  }

  cargarVisitasHoy(): void {
    this.loadingVisitasHoy = true;
    this.errorVisitasHoy = '';

    this.monitorService.obtenerVisitasHoy()
      .pipe(finalize(() => this.loadingVisitasHoy = false))
      .subscribe({
        next: (data) => {
          this.visitasHoy = data;
        },
        error: () => {
          this.errorVisitasHoy = 'No se pudieron cargar las visitas de hoy.';
          this.visitasHoy = null;
        }
      });
  }

  cargarReos(): void {
    this.loadingReos = true;
    this.errorReos = '';

    this.monitorService.obtenerReos()
      .pipe(finalize(() => this.loadingReos = false))
      .subscribe({
        next: (data) => {
          this.reos = data ?? [];
        },
        error: () => {
          this.errorReos = 'No se pudieron cargar los reos.';
          this.reos = [];
        }
      });
  }

  cargarInforme(): void {
    this.loadingInforme = true;
    this.errorInforme = '';

    this.monitorService.obtenerInforme(this.filtros)
      .pipe(finalize(() => this.loadingInforme = false))
      .subscribe({
        next: (data) => {
          this.informe = data;
        },
        error: () => {
          this.errorInforme = 'No se pudo cargar el informe.';
          this.informe = null;
        }
      });
  }

  onFiltrosChange(filtros: MonitorInformeFiltros): void {
    this.filtros = { ...filtros };
  }

  aplicarFiltros(): void {
    this.cargarInforme();
  }

  limpiarFiltros(): void {
    this.filtros = {
      reoId: null,
      fechaDesde: null,
      fechaHasta: null
    };

    this.cargarInforme();
  }

  descargarPdf(): void {
    if (this.downloadingPdf) {
      return;
    }

    this.downloadingPdf = true;

    this.monitorService.descargarInformePdf(this.filtros)
      .pipe(finalize(() => this.downloadingPdf = false))
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const enlace = document.createElement('a');
          enlace.href = url;
          enlace.download = 'informe-monitor.pdf';
          enlace.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.errorInforme = 'No se pudo descargar el PDF.';
        }
      });
  }

  recargarTodo(): void {
    this.cargarStats();
    this.cargarVisitasHoy();
    this.cargarReos();
    this.cargarInforme();
  }
}