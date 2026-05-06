import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidenciasService } from '../../service/incidencias.service';
import { IncidenciaDialogComponent } from '../../components/incidencia-dialog/incidencia-dialog';

import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-incidencias-list',
  standalone: true,
  imports: [
    CommonModule,
    IncidenciaDialogComponent,
    TableModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './incidencia-list.component.html',
  styleUrls: ['./incidencia-list.component.scss']
})
export class IncidenciasListComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private incidenciasService = inject(IncidenciasService);

  @ViewChild('dt') dt!: Table;

  incidencias: any[] = [];
  loading = true;

  dialogVisible = false;
  incidenciaSeleccionada: any = null;

  ngOnInit(): void {
    this.obtenerIncidencias();
  }

  obtenerIncidencias(): void {
    this.loading = true;

    this.incidenciasService.obtener_todos().subscribe({
      next: (data) => {
        this.incidencias = [...(data ?? [])];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar incidencias:', err);
        this.incidencias = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirDialog(): void {
    this.incidenciaSeleccionada = null;
    this.dialogVisible = true;
  }

  editar(inc: any): void {
    this.incidenciaSeleccionada = inc;
    this.dialogVisible = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que quieres eliminar esta incidencia?')) {
      this.incidenciasService.baja_incidente(id).subscribe({
        next: () => this.obtenerIncidencias(),
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('No se pudo eliminar la incidencia');
        }
      });
    }
  }

  recargar(): void {
    this.obtenerIncidencias();
  }

  filtrarIncidencias(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(valor, 'contains');
  }
}