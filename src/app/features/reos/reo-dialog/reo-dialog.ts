import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReoService } from '../service/reo.service';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-reo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // 🔥 CAMBIO IMPORTANTE
    InputTextModule,
    ButtonModule,
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

  reoForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private reoService: ReoService
  ) {
    this.reoForm = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      delito: ['', Validators.required]
    });
  }

  // 🔥 CLAVE: esto sustituye al ngOnInit de la page
  ngOnChanges() {
    if (this.visible) {
      this.reoForm.reset();

      if (this.reoId) {
        this.isEditMode = true;
        this.cargarDatosReo(this.reoId);
      } else {
        this.isEditMode = false;
      }
    }
  }

  cargarDatosReo(id: number) {
    this.reoService.getReoById(id).subscribe({
      next: (reo) => {
        this.reoForm.patchValue(reo);
      },
      error: () => alert('Error al cargar el reo')
    });
  }

  guardar() {
    if (this.reoForm.invalid) {
      alert('Formulario inválido');
      return;
    }

    const data = this.reoForm.value;

    if (this.isEditMode && this.reoId) {
      this.reoService.modificacion_recluso(this.reoId, data).subscribe({
        next: () => {
          alert('Reo actualizado');
          this.guardado.emit();
          this.cerrar.emit();
        },
        error: (err) => alert(err.message)
      });
    } else {
      this.reoService.alta_recluso(data).subscribe({
        next: () => {
          alert('Reo creado');
          this.guardado.emit();
          this.cerrar.emit();
        },
        error: (err) => alert(err.message)
      });
    }
  }

  cerrarDialogo() {
    this.cerrar.emit();
  }
}