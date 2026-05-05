import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciasService } from '../../service/incidencias.service';
import { IncidenciaDialogComponent } from '../../components/incidencia-dialog/incidencia-dialog';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-incidencias-list',
  standalone: true,
  imports: [
    CommonModule,
    IncidenciaDialogComponent,
    TableModule,
    ButtonModule,
    InputTextModule,
    CardModule
  ],
  templateUrl: './incidencia-list.component.html',
  styleUrls: ['./incidencia-list.component.scss']
})
export class IncidenciasListComponent implements OnInit {
  private incidenciasService = inject(IncidenciasService);

  incidencias: any[] = [];
  incidenciasFiltradas: any[] = [];
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
        this.incidencias = data;
        this.incidenciasFiltradas = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar incidencias:', err);
        this.loading = false;
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
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.incidenciasFiltradas = this.incidencias.filter(inc =>
      `${inc.id} ${inc.tipo} ${inc.descripcion} ${inc.reo?.nombre ?? ''} ${inc.reo?.apellido ?? ''}`
        .toLowerCase()
        .includes(valor)
    );
  }
}