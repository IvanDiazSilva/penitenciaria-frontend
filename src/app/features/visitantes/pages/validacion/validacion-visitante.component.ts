import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { VisitantesService } from '../../services/visitantes.service';
import { Visitante } from '../../models/visitante.model';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
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
  styleUrls: ['./validacion-visitante.component.scss'],

})
export class ValidacionVisitanteComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef); // ← AÑADE ESTO
  private visitantesService = inject(VisitantesService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  visitantesPendientes: Visitante[] = [];
  visitantesFiltrados: Visitante[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.cargarVisitantesPendientes();
  }

  cargarVisitantesPendientes() {
    this.loading = true;
    this.error = '';
    this.visitantesPendientes = [];
    this.visitantesFiltrados = [];

    this.visitantesService.getVisitantesPendientes().subscribe({
      next: (visitantes) => {
        this.visitantesPendientes = [...visitantes];
        this.visitantesFiltrados = [...visitantes];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
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

  trackById(index: number, item: Visitante): number {
    return item.id ?? index;
  }

  filtrarVisitantes(event: any) {
    const query = event.target?.value?.trim().toLowerCase() || '';

    if (!query) {
      this.visitantesFiltrados = [...this.visitantesPendientes];
      return;
    }

    this.visitantesFiltrados = this.visitantesPendientes.filter(
      (v) =>
        (v.id?.toString() || '').includes(query) ||
        (v.nombreCompleto || '').toLowerCase().includes(query) ||
        (v.dniNie || '').toLowerCase().includes(query)
    );
  }

  aprobar(id: number) {
    console.log('CLICK aprobar', id);

    if (this.loading) return;

    this.loading = true;

    this.visitantesService.aprobarVisitante(id).subscribe({
      next: () => {
        console.log('APROBADO OK', id);
        this.loading = false;
        this.cdr.detectChanges(); // ← AÑADE ESTO
        this.cargarVisitantesPendientes();

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Visitante con ID ${id} aprobado correctamente.`
        });
      },
      error: (err) => {
        console.error('ERROR aprobar', err);
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

  rechazar(id: number) {
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