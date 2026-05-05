import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
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
export class IncidenciaDialogComponent implements OnInit {

  @Input() visible = false;
  @Input() incidenciaEditar: any = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  private incidenciaService = inject(IncidenciasService);
  private reoService = inject(ReoService);
  private messageService = inject(MessageService);

  modoEditar = false;
  reos: any[] = [];

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
    } else {
      this.modoEditar = false;
      this.resetForm();
    }
  }

  cargarReos(): void {
    this.reoService.obtener_todos().subscribe({
      next: (res) => this.reos = res,
      error: () => console.error('Error al cargar reos')
    });
  }

  guardar(): void {
    if (!this.incidente.tipo || !this.incidente.descripcion || !this.incidente.fechaHora) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Faltan campos obligatorios' });
      return;
    }

    let fechaJava = this.incidente.fechaHora.replace('T', ' ');
    if (fechaJava.length === 16) fechaJava += ':00';

    const payload: any = {
      tipo: this.incidente.tipo,
      descripcion: this.incidente.descripcion,
      fechaHora: fechaJava,
      guardia: { id: Number(this.incidente.idGuardia) }
    };

    if (this.incidente.idReo) {
      payload.reo = { id: Number(this.incidente.idReo) };
    }

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
          detail: err.message
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
  }
}
