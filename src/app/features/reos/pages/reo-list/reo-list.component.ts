import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReoService} from '../../service/reo.service';
import { Reo } from '../../models/reo.model';
import { RouterModule, Router } from '@angular/router'; 

// PrimeNG
import { CardModule } from 'primeng/card'; 
import { InputTextModule } from 'primeng/inputtext'; 
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

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
    InputTextModule,
    TooltipModule
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
    public router: Router 
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * Obtiene la lista actualizada de la Base de Datos
   */
  cargarDatos(): void {
    this.reoService.obtener_todos().subscribe({
      next: (data) => {
        this.reos = data;
        this.reosFiltrados = [...data]; 
        this.cd.detectChanges(); 
        console.log('Sincronización completa con el servidor.');
      },
      error: (err) => {
        console.error('Fallo en la conexión:', err.message);
      }
    });
  }

  /**
   * Filtro de búsqueda dinámico (ID, Nombre, Documento, Delito)
   */
  filtrarReclusos(event: any): void {
    const valor = event.target.value.toLowerCase().trim();

    if (!valor) {
      this.reosFiltrados = [...this.reos];
      return;
    }

    this.reosFiltrados = this.reos.filter(reo => {
      return (
        reo.id?.toString().includes(valor) || 
        reo.nombre.toLowerCase().includes(valor) || 
        reo.dni.toLowerCase().includes(valor) ||
        (reo.delito && reo.delito.toLowerCase().includes(valor))
      );
    });
  }

  editarReo(reo: Reo) {
    if (reo && reo.id) {
      this.router.navigate(['/reos/editar', reo.id]);
    }
  }

  confirmarEliminar(reo: Reo) {
    const mensaje = `¿Confirma la baja definitiva del reo ${reo.nombre}? Esta acción no se puede deshacer.`;
    
    if (confirm(mensaje)) {
      if (!reo.id) return;

      this.reoService.baja_recluso(reo.id).subscribe({
        next: () => {
          this.cargarDatos(); // Refrescamos la tabla
          alert('Expediente eliminado correctamente del sistema.');
        },
        error: (err) => {
          alert(err.message); // Muestra errores de integridad (ej: si tiene condenas pendientes)
        }
      });
    }
  }

  irAMonitorizacion() {
    this.router.navigate(['/monitorizacion']);
  }
}