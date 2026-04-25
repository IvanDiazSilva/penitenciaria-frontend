import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonitorInformeFiltros, ReoOption } from '../../models/monitor-resumen.model';

@Component({
  selector: 'app-monitor-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitor-filtros.component.html',
  styleUrls: ['./monitor-filtros.component.scss']
})
export class MonitorFiltrosComponent {
  @Input() reos: ReoOption[] = [];
  @Input() loadingReos = false;
  @Input() errorMessage = '';
  @Input() filtros: MonitorInformeFiltros = {
    reoId: null,
    fechaDesde: null,
    fechaHasta: null
  };

  @Output() filtrosChange = new EventEmitter<MonitorInformeFiltros>();
  @Output() aplicar = new EventEmitter<void>();
  @Output() limpiar = new EventEmitter<void>();

  onFiltrosChange(): void {
    this.filtrosChange.emit({ ...this.filtros });
  }

  onAplicar(): void {
    this.aplicar.emit();
  }

  onLimpiar(): void {
    this.limpiar.emit();
  }
}