
import { Component, Input, Output, EventEmitter, OnInit, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { IncidenciasService } from '../../service/incidencias.service';
import { ReoService } from '../../../reos/services/reos.service';

@Component({
  selector: 'app-incidencia-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './incidencia-dialog.html',
  styleUrls: ['./incidencia-dialog.scss']
})
export class IncidenciaDialogComponent implements OnInit, OnChanges {

  @Input() visible = false;
  @Input() incidenciaEditar: any = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  private incidenciaService = inject(IncidenciasService);
  private reoService = inject(ReoService);
  private messageService = inject(MessageService);

  modoEditar = false;
  reos: any[] = [];
  
  // Lógica de búsqueda
  reosFiltrados: any[] = [];
  terminoBusqueda: string = '';

  incidente: any = {
    id: null,
    tipo: '',
    descripcion: '',
    fechaHora: '',
    idReo: null,
    idGuardia: 2
  };

  ngOnInit(): void {
    this.cargarReos();
  }

  ngOnChanges(): void {
    if (this.visible) {
      if (this.incidenciaEditar) {
        this.modoEditar = true;
        this.incidente = {
          id: this.incidenciaEditar.id,
          tipo: this.incidenciaEditar.tipo || '',
          descripcion: this.incidenciaEditar.descripcion || '',
          fechaHora: this.incidenciaEditar.fechaHora
            ? this.incidenciaEditar.fechaHora.replace(' ', 'T').slice(0, 16)
            : '',
          idReo: this.incidenciaEditar.reo?.id || null,
          idGuardia: this.incidenciaEditar.guardia?.id || 2
        };
        // Para que aparezca el nombre en el buscador al editar
        this.terminoBusqueda = this.incidenciaEditar.reo 
          ? `${this.incidenciaEditar.reo.nombre} ${this.incidenciaEditar.reo.apellido}` 
          : '';
      } else {
        this.modoEditar = false;
        this.resetForm();
      }
    }
  }

  cargarReos(): void {
    this.reoService.obtener_todos().subscribe({
      next: (res) => this.reos = res,
      error: () => console.error('Error al cargar reos')
    });
  }

  // --- NUEVAS FUNCIONES PARA EL BUSCADOR ---
  buscarReo(): void {
  const busqueda = this.terminoBusqueda ? this.terminoBusqueda.toLowerCase().trim() : '';
  
  if (busqueda.length < 2) {
    this.reosFiltrados = [];
    return;
  }

  this.reosFiltrados = this.reos.filter(reo => {
    // Validamos que reo, reo.nombre y reo.dni existan antes de usar toLowerCase()
    const nombre = reo?.nombre ? reo.nombre.toLowerCase() : '';
    const dni = reo?.dni ? reo.dni.toLowerCase() : '';
    
    return nombre.includes(busqueda) || dni.includes(busqueda);
  }).slice(0, 10);
}

seleccionarReo(reo: any): void {
  this.incidente.idReo = reo.id;
  // Actualizamos el input con el nombre completo para que el usuario vea qué seleccionó
  this.terminoBusqueda = `${reo.nombre} ${reo.apellido}`;
  // Vaciamos la lista para que el desplegable desaparezca
  this.reosFiltrados = [];
}
  // ---------------------------------------

  guardar(): void {
    if (!this.incidente.tipo || !this.incidente.descripcion || !this.incidente.fechaHora || !this.incidente.idReo) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Faltan campos obligatorios o seleccionar interno' });
      return;
    }

    let fechaJava = this.incidente.fechaHora.replace('T', ' ');
    if (fechaJava.length === 16) fechaJava += ':00';

    const payload: any = {
      tipo: this.incidente.tipo,
      descripcion: this.incidente.descripcion,
      fechaHora: fechaJava,
      guardia: { id: Number(this.incidente.idGuardia) },
      reo: { id: Number(this.incidente.idReo) }
    };

    const request$ = this.modoEditar
      ? this.incidenciaService.modificacion_incidente(this.incidente.id, payload)
      : this.incidenciaService.alta_incidente(payload);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'OK',
          detail: this.modoEditar ? 'Actualizado' : 'Creado'
        });
        this.guardado.emit();
        this.cerrarDialogo();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.mensaje || 'Error al guardar'
        });
      }
    });
  }

  cerrarDialogo(): void {
    this.visible = false;
    this.cerrar.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.incidente = {
      id: null,
      tipo: '',
      descripcion: '',
      fechaHora: '',
      idReo: null,
      idGuardia: 2
    };
    this.terminoBusqueda = '';
    this.reosFiltrados = [];
  }
}