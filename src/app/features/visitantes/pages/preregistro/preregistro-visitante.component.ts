import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { VisitantesService } from '../../services/visitantes.service';
import { PreregistroVisitanteRequest } from '../../models/preregistro-visitante-request.model';

@Component({
  selector: 'app-preregistro-visitante',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    MessageModule,
    FloatLabelModule
  ],
  templateUrl: './preregistro-visitante.component.html',
  styleUrls: ['./preregistro-visitante.component.scss']
})
export class PreregistroVisitanteComponent {
  mensaje = '';
  error = '';
  preregistroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private visitantesService: VisitantesService
  ) {
    this.preregistroForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      dniNie: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      nacionalidad: [''],
      telefono: [''],
      email: ['', Validators.email],
      direccion: [''],
      nombreInterno: [''],
      parentesco: [''],
      aceptaNormativa: [false, Validators.requiredTrue]
    });
  }

 onSubmit(): void {
  this.mensaje = '';
  this.error = '';

  if (this.preregistroForm.invalid) {
    this.preregistroForm.markAllAsTouched();
    return;
  }

  const request: PreregistroVisitanteRequest = this.preregistroForm.getRawValue();

  this.visitantesService.preregistrarVisitante(request).subscribe({
    next: () => {
      this.mensaje = 'Pre-registro realizado correctamente.';
      this.preregistroForm.reset({
        nombreCompleto: '',
        dniNie: '',
        password: '',
        nacionalidad: '',
        telefono: '',
        email: '',
        direccion: '',
        nombreInterno: '',
        parentesco: '',
        aceptaNormativa: false
      });
    },
    error: (err: { error: { message: string } }) => {
      this.error = err?.error?.message || 'Error al realizar el pre-registro.';
    }
  });
}
}
