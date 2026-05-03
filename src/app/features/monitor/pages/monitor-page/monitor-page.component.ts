import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { MonitorService } from '../../services/monitor.service';
import {
  MonitorStats,
  MonitorVisitasHoy,
  MonitorInformeFiltros
} from '../../models/monitor-resumen.model';

import { MonitorStatsComponent } from '../../components/monitor-stats/monitor-stats.component';
import { MonitorVisitasHoyComponent } from '../../components/monitor-visitas-hoy/monitor-visitas-hoy.component';

@Component({
  selector: 'app-monitor-page',
  standalone: true,
  imports: [
    CommonModule,
    MonitorStatsComponent,
    MonitorVisitasHoyComponent
  ],
  templateUrl: './monitor-page.component.html',
  styleUrls: ['./monitor-page.component.scss']
})
export class MonitorPageComponent implements OnInit {
  stats: MonitorStats | null = null;
  visitasHoy: MonitorVisitasHoy | null = null;

  loadingStats = false;
  loadingVisitasHoy = false;
  downloadingPdf = false;

  errorStats = '';
  errorVisitasHoy = '';
  errorInforme = '';

  // Se mantiene para el PDF (aunque no haya filtros visibles)
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
  }

  cargarStats(): void {
    this.loadingStats = true;
    this.errorStats = '';
    this.cdr.detectChanges();

    this.monitorService.obtenerStats()
      .pipe(finalize(() => {
        this.loadingStats = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          this.stats = data;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorStats = 'No se pudieron cargar las estadísticas.';
          this.stats = null;
          this.cdr.detectChanges();
        }
      });
  }

  cargarVisitasHoy(): void {
    this.loadingVisitasHoy = true;
    this.errorVisitasHoy = '';
    this.cdr.detectChanges();

    this.monitorService.obtenerVisitasHoy()
      .pipe(finalize(() => {
        this.loadingVisitasHoy = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          this.visitasHoy = data;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorVisitasHoy = 'No se pudieron cargar las visitas de hoy.';
          this.visitasHoy = null;
          this.cdr.detectChanges();
        }
      });
  }

  descargarPdf(): void {
    if (this.downloadingPdf) return;

    this.downloadingPdf = true;
    this.errorInforme = '';
    this.cdr.detectChanges();

    this.monitorService.descargarInformePdf(this.filtros)
      .pipe(finalize(() => {
        this.downloadingPdf = false;
        this.cdr.detectChanges();
      }))
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
          this.cdr.detectChanges();
        }
      });
  }

  recargarTodo(): void {
    this.cargarStats();
    this.cargarVisitasHoy();
  }
}