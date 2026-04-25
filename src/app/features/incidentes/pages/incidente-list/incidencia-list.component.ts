import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Incidente } from '../../models/incidente.models';
import { IncidenciasService } from '../../service/incidencias.service';


@Component({
  selector: 'app-incidencia-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, TableModule, ButtonModule, 
    CardModule, InputTextModule, TagModule, ToastModule, ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './incidencia-list.component.html',
  styleUrl: './incidencia-list.component.scss'
})
export class IncidenciaListComponent implements OnInit {
  // Inyecciones
  private incidenciaService = inject(IncidenciasService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  // Variables de estado
  incidentes: Incidente[] = [];
  incidentesFiltrados: Incidente[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.cargarDatos();
  }

cargarDatos(): void {
  this.loading = true; // Mostramos el spinner
  this.incidenciaService.obtener_todos().subscribe({
    next: (res) => {
      console.log('Datos recibidos de la BD:', res); // <--- MIRA LA CONSOLA DEL NAVEGADOR
      this.incidentes = res;
      this.incidentesFiltrados = res;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar:', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      this.loading = false;
    }
  });
}

  filtrar(event: any): void {
    const valor = event.target.value.toLowerCase();
    this.incidentesFiltrados = this.incidentes.filter(i => 
      i.tipo.toLowerCase().includes(valor) || 
      i.descripcion.toLowerCase().includes(valor) ||
      i.idReo.toString().includes(valor)
    );
  }

  irAFuomulario(id?: number): void {
    if (id) {
      this.router.navigate(['/incidencias/editar', id]);
    } else {
      this.router.navigate(['/incidencias/nuevo']);
    }
  }

  confirmar_baja(incidente: Incidente): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el incidente #${incidente.id}? Esta acción no se puede deshacer.`,
      header: 'Confirmar Baja de Incidente',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.incidenciaService.baja_incidente(incidente.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Incidente eliminado correctamente' });
            this.cargarDatos(); // Recarga la lista
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error al eliminar', detail: err.message });
          }
        });
      }
    });
  }
}