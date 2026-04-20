import { Component, OnInit } from '@angular/core';
import { Reo, ReoService } from '../../core/services/reo.services';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-reo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reo-list.component.html',
  styleUrls: ['./reo-list.component.scss']
})
export class ReoListComponent implements OnInit {
  loading: boolean = false;
  errorMsg: string | null = null;
  reos: Reo[] = [];
  totalReos: number = 0;

  constructor(private reoService: ReoService) {}

  ngOnInit(): void {
    this.loadReos();
  }

  loadReos(): void {
    this.loading = true;
    this.errorMsg = null;

    this.reoService.getReos().subscribe({
      next: (data) => {
        this.reos = data;
        this.totalReos = data.length;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar reos: ' + err.message;
        this.loading = false;
      }
    });
  }

  isEmpty(): boolean {
    return this.reos.length === 0 && !this.loading;
  }
}