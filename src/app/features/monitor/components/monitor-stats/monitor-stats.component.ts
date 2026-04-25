import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MonitorStats } from '../../models/monitor-resumen.model';

@Component({
  selector: 'app-monitor-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitor-stats.component.html',
  styleUrls: ['./monitor-stats.component.scss']
})
export class MonitorStatsComponent {
  @Input() stats: MonitorStats | null = null;
  @Input() loading = false;
  @Input() errorMessage = '';
}