
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Añade ChangeDetectorRef
// Importamos el Servicio y la Interfaz desde Core
import { CommonModule } from '@angular/common'; 
import { TableModule } from 'primeng/table';    
import { ButtonModule } from 'primeng/button';  
import { ReoService, Reo } from '../../../../core/services/reo.services'; 
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';



@Component({
  selector: 'app-reo-list',
  standalone: true,
  imports: [
    CommonModule,  
    TableModule,
    RouterModule,   
    ButtonModule  
  ],
  templateUrl: './reo-list.component.html',
  styleUrls: ['./reo-list.component.scss']
})
export class ReoListComponent implements OnInit {
  // Usamos el modelo Reo que viene del servicio
  reos: Reo[] = [];

  constructor(
    private reoService: ReoService,
    private cd: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.reoService.getAllReos().subscribe({
      next: (data) => {
        this.reos = data;
        // 3. Forzamos a Angular a que se entere del cambio de forma segura
        this.cd.detectChanges(); 
        console.log('Datos cargados y refrescados:', this.reos);
      },
      error: (err) => console.error('Error:', err)
    });
  }
}