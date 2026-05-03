import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReoService } from '../service/reo.service';
// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './reo-dialog.html',
  styleUrls: ['./reo-dialog.scss']
})
export class ReoDialogComponent {

  @Input() visible = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  reo: any = {
    nombre: '',
    apellido: '',
    dni: '',
    delito: ''
  };

  constructor(private reoService: ReoService) {}

  cerrarDialogo() {
    this.cerrar.emit();
  }

  guardar() {
    if (!this.reo.nombre || !this.reo.dni || !this.reo.delito) {
      alert('Completa los campos obligatorios');
      return;
    }

    this.reoService.alta_recluso(this.reo).subscribe({
      next: () => {
        alert('Reo creado correctamente');
        this.guardado.emit();
        this.cerrar.emit();
        this.resetForm();
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  resetForm() {
    this.reo = {
      nombre: '',
      apellido: '',
      dni: '',
      delito: ''
    };
  }
}
