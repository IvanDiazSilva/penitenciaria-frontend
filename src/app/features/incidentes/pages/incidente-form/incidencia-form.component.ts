import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { IncidenciasService } from '../../service/incidencias.service';
import { ReoService } from '../../../reos/services/reos.service';

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
  private cdr = inject(ChangeDetectorRef);

  modoEditar: boolean = false;
  reos: any[] = []; 
  
  // Lógica del buscador
  reosFiltrados: any[] = [];
  terminoBusqueda: string = '';

  // Objeto inicial con idGuardia fijo en 2
  incidente: any = {
    id: null,
    tipo: '',
    descripcion: '',
    fechaHora: '', 
    idReo: null,
    idGuardia: 2 // <--- ID FIJO
  };

  ngOnInit(): void {
    this.cargarReos();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.modoEditar = true;
      this.cargarIncidencia(id);
    }
  }

  cargarIncidencia(id: number): void {
    this.incidenciaService.getIncidenciaById(id).subscribe({
      next: (res: any) => {
        this.incidente = {
          id: res.id,
          tipo: res.tipo || '',
          descripcion: res.descripcion || '',
          fechaHora: res.fechaHora ? res.fechaHora.replace(' ', 'T').slice(0, 16) : '',
          idReo: res.reo ? res.reo.id : null,
          idGuardia: 2 // <--- Forzamos que siga siendo 2 al cargar
        };

        // Si hay un reo al cargar, actualizamos el texto del buscador
        if (this.incidente.idReo) {
          this.actualizarTextoBusquedaEdicion();
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener incidencia:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el registro' });
      }
    });
  }

  cargarReos(): void {
    this.reoService.obtener_todos().subscribe({
      next: (res) => {
        this.reos = res;
        this.reosFiltrados = [];
        // Por si los reos cargan después que la incidencia en edición
        if (this.modoEditar && this.incidente.idReo) {
          this.actualizarTextoBusquedaEdicion();
        }
        this.cdr.detectChanges();
      },
      error: () => console.error('Error al cargar reos')
    });
  }

  // Métodos del Buscador
  buscarReo(): void {
    const busqueda = this.terminoBusqueda.toLowerCase().trim();
    if (busqueda.length < 2) {
      this.reosFiltrados = [];
      return;
    }
    this.reosFiltrados = this.reos.filter(reo => 
      reo.nombre.toLowerCase().includes(busqueda) || 
      reo.dni.toLowerCase().includes(busqueda)
    ).slice(0, 10);
  }

  seleccionarReo(reo: any): void {
    this.incidente.idReo = reo.id;
    this.terminoBusqueda = `${reo.nombre} (${reo.dni})`;
    this.reosFiltrados = [];
  }

  private actualizarTextoBusquedaEdicion(): void {
    const reoEncontrado = this.reos.find(r => r.id === this.incidente.idReo);
    if (reoEncontrado) {
      this.terminoBusqueda = `${reoEncontrado.nombre} (${reoEncontrado.dni})`;
    }
  }

  guardar(): void {
    // Validación estricta de todos los campos necesarios
    if (!this.incidente.tipo || !this.incidente.descripcion || !this.incidente.fechaHora || !this.incidente.idReo) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Campos incompletos', 
        detail: 'Por favor, rellene todos los campos y seleccione un interno.' 
      });
      return;
    }

    // Aseguramos el formato de fecha
    let fechaJava = this.incidente.fechaHora.replace('T', ' ');
    if (fechaJava.length === 16) fechaJava += ":00";

    const payload: any = {
      tipo: this.incidente.tipo,
      descripcion: this.incidente.descripcion,
      fechaHora: fechaJava,
      guardia: { id: 2 }, // <--- ID SIEMPRE FIJO EN EL ENVÍO
      reo: { id: Number(this.incidente.idReo) }
    };

    if (this.modoEditar) {
      payload.id = this.incidente.id;
      this.incidenciaService.modificacion_incidente(this.incidente.id, payload).subscribe({
        next: () => this.notificarExito('Reporte actualizado correctamente'),
        error: (err) => this.notificarError(err)
      });
    } else {
      this.incidenciaService.alta_incidente(payload).subscribe({
        next: () => this.notificarExito('Incidencia registrada correctamente'),
        error: (err) => this.notificarError(err)
      });
    }
  }

  private notificarExito(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Hecho', detail: msg });
    setTimeout(() => this.router.navigate(['/incidencias']), 1500);
  }

  private notificarError(err: any) {
    console.error('Error del servidor:', err);
    const errorMsg = err.error?.error || 'Error al procesar la solicitud';
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
  }
}