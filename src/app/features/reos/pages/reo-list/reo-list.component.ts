import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReoService, Reo } from '../../../../core/services/reo.services'; 
import { RouterModule, Router } from '@angular/router'; // 1. Añadimos Router aquí
import { CardModule } from 'primeng/card'; // 1. Importa el módulo de Card
import { InputTextModule } from 'primeng/inputtext'; // Para el buscador
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
    RippleModule, // Añadido por si usas pRipple
    CardModule,      // 2. Añádelo aquí
    InputTextModule  // 2. Añádelo aquí
  ],
  templateUrl: './reo-list.component.html',
  styleUrls: ['./reo-list.component.scss']
})
export class ReoListComponent implements OnInit {
  reos: Reo[] = [];

  constructor(
    private reoService: ReoService,
    private cd: ChangeDetectorRef,
    private router: Router // 2. INYECTAMOS EL ROUTER AQUÍ
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.reoService.getAllReos().subscribe({
      next: (data) => {
        this.reos = data;
        this.cd.detectChanges(); 
        console.log('Datos cargados:', this.reos);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  editarReo(reo: any) {
    console.log('Navegando al reo:', reo);
    // 3. DESCOMENTADO Y LISTO:
    if (reo && reo.id) {
      this.router.navigate(['/reos/editar', reo.id]);
    } else {
      console.error('Error: El reo no tiene ID');
    }
  }

  confirmarEliminar(reo: any) {
    const mensaje = `¿Estás seguro de que quieres eliminar a ${reo.nombre}?`;
    if (confirm(mensaje)) {
      console.log('Eliminando reo con ID:', reo.id);
      // Aquí llamarás al servicio de tu compañero cuando esté listo
    }
  }
  irAMonitorizacion() {
  this.router.navigate(['/monitorizacion']); // Ajusta la ruta según tu app-routing.module
}
}