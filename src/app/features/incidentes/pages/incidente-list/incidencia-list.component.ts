import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Incidente } from '../../models/incidente.models';
import { IncidenciasService } from '../../service/incidencias.service';

@Component({
  selector: 'app-incidencia-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, TableModule, ButtonModule, 
    CardModule, InputTextModule
  ],
  templateUrl: './incidencia-list.component.html',
  styleUrl: './incidencia-list.component.scss'
})
export class IncidenciaListComponent implements OnInit {
  incidentes: Incidente[] = [];
  incidentesFiltrados: Incidente[] = [];
  loading: boolean = false;

  constructor(
    private incidenciaService: IncidenciasService,
    private cd: ChangeDetectorRef, // Usamos la misma técnica que en Reos
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.incidenciaService.obtener_todos().subscribe({
      next: (data) => {
        this.incidentes = data;
        this.incidentesFiltrados = data; // Igualamos para que la tabla no nazca vacía
        
        this.loading = false;
        this.cd.detectChanges(); // Forzamos la detección de cambios como en Reos
        console.log('Incidencias cargadas:', this.incidentesFiltrados);
      },
      error: (err) => {
        console.error('Error al conectar:', err.message);
        this.loading = false;
      }
    });
  }

  filtrar(event: any): void {
    const valor = event.target.value.toLowerCase().trim();
    if (!valor) {
      this.incidentesFiltrados = [...this.incidentes];
      return;
    }
    this.incidentesFiltrados = this.incidentes.filter(i => 
      i.tipo.toLowerCase().includes(valor) || 
      i.descripcion.toLowerCase().includes(valor) ||
      i.id?.toString().includes(valor)
    );
  }

  irAFuomulario(id?: number): void {
    if (id) {
      this.router.navigate(['/incidencias/editar', id]);
    } else {
      this.router.navigate(['/incidencias/nuevo']);
    }
  }

  confirmarEliminar(incidente: any) {
    if (confirm(`¿Eliminar reporte #${incidente.id}?`)) {
      this.incidenciaService.baja_incidente(incidente.id).subscribe({
        next: () => {
          this.cargarDatos();
          alert('Eliminado correctamente');
        },
        error: (err) => alert(err.message)
      });
    }
  }
}