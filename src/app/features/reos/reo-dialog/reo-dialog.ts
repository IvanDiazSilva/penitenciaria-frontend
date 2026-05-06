import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { ReoService } from '../service/reo.service';

@Component({
  selector: 'app-reo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // 🔥 Para ngModel
    InputTextModule,
    ButtonModule,
    TextareaModule,
    DialogModule
  ],
  templateUrl: './reo-dialog.html',
  styleUrls: ['./reo-dialog.scss']
})
export class ReoDialogComponent implements OnChanges {

  @Input() visible = false;
  @Input() reoId: number | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  private reoService = inject(ReoService);

  // 🔥 Objeto directo como en incidencias
  reo: any = {
    nombre: '',
    dni: '',
    delito: ''
  };

  isEditMode = false;

  ngOnChanges(): void {
    if (this.visible) {
      if (this.reoId) {
        this.isEditMode = true;
        this.cargarDatosReo(this.reoId);
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  cargarDatosReo(id: number): void {
    this.reoService.getReoById(id).subscribe({
      next: (reo) => {
        this.reo = reo;
      },
      error: () => alert('Error al cargar el reo')
    });
  }

  guardar(): void {
    if (!this.reo.nombre || !this.reo.dni || !this.reo.delito) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    if (this.isEditMode && this.reoId) {
      this.reoService.modificacion_recluso(this.reoId, this.reo).subscribe({
        next: () => {
          alert('Reo actualizado');
          this.guardado.emit();
          this.cerrarDialogo();
        },
        error: (err) => alert(err.message)
      });
    } else {
      this.reoService.alta_recluso(this.reo).subscribe({
        next: () => {
          alert('Reo creado');
          this.guardado.emit();
          this.cerrarDialogo();
        },
        error: (err) => alert(err.message)
      });
    }
  }

  cerrarDialogo(): void {
    this.cerrar.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.reo = {
      nombre: '',
      dni: '',
      delito: ''
    };
  }
}