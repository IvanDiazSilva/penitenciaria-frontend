import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MonitorInforme } from '../../models/monitor-resumen.model';

@Component({
  selector: 'app-monitor-informe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitor-informe.component.html',
  styleUrls: ['./monitor-informe.component.scss']
})
export class MonitorInformeComponent {
  @Input() informe: MonitorInforme | null = null;
  @Input() loading = false;
  @Input() errorMessage = '';
  @Input() downloadingPdf = false;

  @Output() descargarPdf = new EventEmitter<void>();

  onDescargarPdf(): void {
    this.descargarPdf.emit();
  }
}