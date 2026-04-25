import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MonitorVisitasHoy } from '../../models/monitor-resumen.model';

@Component({
  selector: 'app-monitor-visitas-hoy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitor-visitas-hoy.component.html',
  styleUrls: ['./monitor-visitas-hoy.component.scss']
})
export class MonitorVisitasHoyComponent {
  @Input() visitasHoy: MonitorVisitasHoy | null = null;
  @Input() loading = false;
  @Input() errorMessage = '';
}