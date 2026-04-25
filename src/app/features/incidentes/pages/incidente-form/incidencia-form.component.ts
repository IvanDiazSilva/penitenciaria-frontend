import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Usamos solo lo básico que ya sabemos que funciona en tu proyecto
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


import { IncidenciasService } from '../../service/incidencias.service';
import { ReoService } from '../../../reos/service/reo.service';
import { Incidente } from '../../models/incidente.models';

@Component({
  selector: 'app-incidencia-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    CardModule, 
    ButtonModule, 
    InputTextModule, 
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './incidencia-form.component.html',
  styleUrl: './incidencia-form.component.scss'
})
export class IncidenciaFormComponent implements OnInit {
  private incidenciaService = inject(IncidenciasService);
  private reoService = inject(ReoService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  modoEditar: boolean = false;
  reos: any[] = []; // Lista de reos para el select
  
  incidente: Incidente = {
    tipo: '',
    descripcion: '',
    idGuardia: 1, 
    fechaHora: '', 
    idReo: 0
  };

  ngOnInit(): void {
    this.cargarReos();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.modoEditar = true;
      this.incidenciaService.getIncidenciaById(id).subscribe({
        next: (res) => this.incidente = res,
        error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
      });
    } else {
      // Fecha actual en formato YYYY-MM-DDTHH:MM para el input datetime-local
      const ahora = new Date();
      ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
      this.incidente.fechaHora = ahora.toISOString().slice(0, 16);
    }
  }

  cargarReos(): void {
    this.reoService.obtener_todos().subscribe({
      next: (res) => this.reos = res,
      error: () => console.error('No se pudieron cargar los reos')
    });
  }

  guardar(): void {
    if (this.modoEditar) {
      this.incidenciaService.modificacion_incidente(this.incidente.id!, this.incidente).subscribe({
        next: () => this.exito('Actualizado'),
        error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
      });
    } else {
      this.incidenciaService.alta_incidente(this.incidente).subscribe({
        next: () => this.exito('Registrado'),
        error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
      });
    }
  }

  private exito(texto: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: texto });
    setTimeout(() => this.router.navigate(['/incidencias']), 1000);
  }
}