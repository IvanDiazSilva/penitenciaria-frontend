import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReoService} from '../../services/reos.service';
import {Reo} from '../../models/reo.model'
import { RouterModule, Router } from '@angular/router'; 
import { CardModule } from 'primeng/card'; 
import { InputTextModule } from 'primeng/inputtext'; 
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-reo-list',
  standalone: true,
  imports: [
    CommonModule,  
    TableModule,
    RouterModule,   
    ButtonModule,
    RippleModule, 
    CardModule,      
    InputTextModule  
  ],
  templateUrl: './reo-list.component.html',
  styleUrls: ['./reo-list.component.scss']
})
export class ReoListComponent implements OnInit {
  reos: Reo[] = [];
  reosFiltrados: Reo[] = [];

  constructor(
    private reoService: ReoService,
    private cd: ChangeDetectorRef,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * CONEXIÓN CON BD: Carga la lista completa de reclusos.
   * Usa el método 'obtener_todos' definido en el servicio.
   */
  cargarDatos(): void {
  this.reoService.obtener_todos().subscribe({
    next: (data) => {
      this.reos = data;
      // ESTA ES LA CLAVE: Si no igualas reosFiltrados aquí, la tabla nace vacía
      this.reosFiltrados = data; 
      
      this.cd.detectChanges(); 
      console.log('Datos cargados y filtrados inicializados:', this.reosFiltrados);
    },
    error: (err) => {
      console.error('Error al conectar:', err.message);
    }
  });

  }

  /**
   * Lógica del buscador por ID, Nombre o DNI
   */
  filtrarReclusos(event: any): void {
    const valor = event.target.value.toLowerCase().trim();

    if (!valor) {
      this.reosFiltrados = [...this.reos]; // Si está vacío, mostramos todos
      return;
    }

    this.reosFiltrados = this.reos.filter(reo => {
      return (
        reo.id?.toString().includes(valor) ||           // Filtro por ID
        reo.nombre.toLowerCase().includes(valor) ||     // Filtro por Nombre
        reo.apellido?.toLowerCase().includes(valor) ||  // Filtro por Apellido
        reo.dni.toLowerCase().includes(valor)           // Filtro por DNI
      );
    });
  }

  editarReo(reo: any) {
    console.log('Navegando a la ficha del reo:', reo.nombre);
    if (reo && reo.id) {
      this.router.navigate(['/reos/editar', reo.id]);
    } else {
      console.error('Error de integridad: El registro no tiene una Primary Key (ID) válida');
    }
  }

  /**
   * CASO DE USO: BAJA RECLUSO
   * Ejecuta la eliminación física en la base de datos tras confirmación.
   */
  confirmarEliminar(reo: any) {
    const mensaje = `¿Estás seguro de que quieres dar de baja a ${reo.nombre}? Esta acción es irreversible en la base de datos.`;
    
    if (confirm(mensaje)) {
      console.log('Solicitando baja del ID:', reo.id);
      
      // Llamamos al nuevo nombre del método: baja_recluso
      this.reoService.baja_recluso(reo.id).subscribe({
        next: () => {
          console.log('Registro eliminado correctamente de la tabla reos');
          
          // REFRESCADO DINÁMICO: Volvemos a consultar la BD para actualizar la tabla en pantalla
          this.cargarDatos(); 
          
          alert('Recluso dado de baja correctamente.');
        },
        error: (err) => {
          // El mensaje aquí será el que personalizamos en el handleError (ej: si tiene incidentes)
          console.error('La BD denegó la operación:', err.message);
          alert(err.message);
        }
      });
    }
  }

  irAMonitorizacion() {
    this.router.navigate(['/monitorizacion']);
  }
}