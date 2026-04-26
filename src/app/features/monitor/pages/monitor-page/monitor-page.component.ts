import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(
    private monitorService: MonitorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('MONITOR INIT');
    this.cargarStats();
    this.cargarVisitasHoy();
    this.cargarReosEInforme();
  }

  cargarStats(): void {
    this.loadingStats = true;
    this.errorStats = '';
    console.log('INICIO cargarStats');
    this.cdr.detectChanges();

    this.monitorService.obtenerStats()
      .pipe(finalize(() => {
        this.loadingStats = false;
        console.log('FIN cargarStats');
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          console.log('OK cargarStats', data);
          this.stats = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR cargarStats', err);
          this.errorStats = 'No se pudieron cargar las estadísticas.';
          this.stats = null;
          this.cdr.detectChanges();
        }
      });
  }

  cargarVisitasHoy(): void {
    this.loadingVisitasHoy = true;
    this.errorVisitasHoy = '';
    console.log('INICIO cargarVisitasHoy');
    this.cdr.detectChanges();

    this.monitorService.obtenerVisitasHoy()
      .pipe(finalize(() => {
        this.loadingVisitasHoy = false;
        console.log('FIN cargarVisitasHoy');
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          console.log('OK cargarVisitasHoy', data);
          this.visitasHoy = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR cargarVisitasHoy', err);
          this.errorVisitasHoy = 'No se pudieron cargar las visitas de hoy.';
          this.visitasHoy = null;
          this.cdr.detectChanges();
        }
      });
  }

  cargarReosEInforme(): void {
    this.loadingReos = true;
    this.errorReos = '';
    console.log('INICIO cargarReos');
    this.cdr.detectChanges();

    this.monitorService.obtenerReos()
      .pipe(finalize(() => {
        this.loadingReos = false;
        console.log('FIN cargarReos');
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          console.log('OK cargarReos', data);
          this.reos = data ?? [];
          this.cdr.detectChanges();
          this.cargarInforme();
        },
        error: (err) => {
          console.error('ERROR cargarReos', err);
          this.errorReos = 'No se pudieron cargar los reos.';
          this.reos = [];
          this.cdr.detectChanges();
          this.cargarInforme();
        }
      });
  }

  cargarInforme(): void {
    this.loadingInforme = true;
    this.errorInforme = '';
    console.log('INICIO cargarInforme', this.filtros);
    this.cdr.detectChanges();

    this.monitorService.obtenerInforme(this.filtros)
      .pipe(finalize(() => {
        this.loadingInforme = false;
        console.log('FIN cargarInforme');
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          console.log('OK cargarInforme', data);
          this.informe = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR cargarInforme', err);
          this.errorInforme = 'No se pudo cargar el informe.';
          this.informe = null;
          this.cdr.detectChanges();
        }
      });
  }

  onFiltrosChange(filtros: MonitorInformeFiltros): void {
    console.log('CAMBIO filtros', filtros);
    this.filtros = { ...filtros };
    this.cdr.detectChanges();
  }

  aplicarFiltros(): void {
    console.log('APLICAR filtros');
    this.cargarInforme();
  }

  limpiarFiltros(): void {
    console.log('LIMPIAR filtros');
    this.filtros = {
      reoId: null,
      fechaDesde: null,
      fechaHasta: null
    };
    this.cdr.detectChanges();
    this.cargarInforme();
  }

  descargarPdf(): void {
    if (this.downloadingPdf) {
      return;
    }

    this.downloadingPdf = true;
    this.errorInforme = '';
    console.log('INICIO descargarPdf', this.filtros);
    this.cdr.detectChanges();

    this.monitorService.descargarInformePdf(this.filtros)
      .pipe(finalize(() => {
        this.downloadingPdf = false;
        console.log('FIN descargarPdf');
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (blob: Blob) => {
          console.log('OK descargarPdf', blob);
          const url = window.URL.createObjectURL(blob);
          const enlace = document.createElement('a');
          enlace.href = url;
          enlace.download = 'informe-monitor.pdf';
          enlace.click();
          window.URL.revokeObjectURL(url);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR descargarPdf', err);
          this.errorInforme = 'No se pudo descargar el PDF.';
          this.cdr.detectChanges();
        }
      });
  }

  recargarTodo(): void {
    console.log('RECARGAR TODO');
    this.cargarStats();
    this.cargarVisitasHoy();
    this.cargarReosEInforme();
  }
}