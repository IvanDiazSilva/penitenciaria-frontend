import { Component, inject, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { VisitantesService } from '../../services/visitantes.service';
import { Visitante } from '../../models/visitante.model';

import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-validacion-visitante',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    MessageModule,
    TableModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './validacion-visitante.component.html',
  styleUrls: ['./validacion-visitante.component.scss']
})
export class ValidacionVisitanteComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private visitantesService = inject(VisitantesService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  @ViewChild('dt') dt!: Table;

  visitantesPendientes: Visitante[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.cargarVisitantesPendientes();
  }

  cargarVisitantesPendientes(): void {
    this.loading = true;
    this.error = '';
    this.visitantesPendientes = [];

    this.visitantesService.getVisitantesPendientes().subscribe({
      next: (visitantes) => {
        this.visitantesPendientes = [...visitantes];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar visitantes pendientes. Inténtelo de nuevo.';
        this.cdr.detectChanges();

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.error
        });
      }
    });
  }

  filtrarVisitantes(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(query, 'contains');
  }

  aprobar(id: number): void {
    if (this.loading) return;

    this.loading = true;

    this.visitantesService.aprobarVisitante(id).subscribe({
      next: () => {
        this.loading = false;
        this.cargarVisitantesPendientes();

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Visitante con ID ${id} aprobado correctamente.`
        });
      },
      error: (err) => {
        this.loading = false;

        const msg =
          err?.error?.mensaje ||
          'Error al aprobar el visitante. Inténtelo de nuevo.';

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: msg
        });
      }
    });
  }

  rechazar(id: number): void {
    if (this.loading) return;

    this.loading = true;

    this.visitantesService.rechazarVisitante(id).subscribe({
      next: () => {
        this.loading = false;
        this.cargarVisitantesPendientes();

        this.messageService.add({
          severity: 'info',
          summary: 'Rechazado',
          detail: `Visitante con ID ${id} rechazado correctamente.`
        });
      },
      error: (err) => {
        this.loading = false;

        const msg =
          err?.error?.mensaje ||
          'Error al rechazar el visitante. Inténtelo de nuevo.';

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: msg
        });
      }
    });
  }
}