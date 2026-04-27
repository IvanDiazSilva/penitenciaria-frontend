import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // <--- 1. IMPORTA Router y RouterModule AQUÍ

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { VisitantesService } from '../../services/visitantes.service';
import { PreregistroVisitanteRequest } from '../../models/preregistro-visitante.request';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-preregistro-visitante',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, // <--- 2. AÑÁDELO AQUÍ para que funcione la navegación
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
  // 1. Usamos la función inject en lugar del constructor
  private fb = inject(FormBuilder);
  private visitantesService = inject(VisitantesService);
  private router = inject(Router);

  mensaje = '';
  error = '';
  preregistroForm: FormGroup;

  constructor() {
    // 2. El constructor ahora solo se encarga de inicializar el formulario
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

  // Obtenemos los valores del formulario
  const val = this.preregistroForm.value;

  // CREAMOS EL OBJETO EXACTO que espera el backend
  // Nota: Omitimos 'nombreInterno' porque el endpoint de preregistro no lo procesa
  const requestBody = {
    nombreCompleto: val.nombreCompleto,
    dniNie: val.dniNie,
    password: val.password,
    nacionalidad: val.nacionalidad || null,
    telefono: val.telefono || null,
    email: val.email || null,
    direccion: val.direccion || null,
    parentesco: val.parentesco || null,
    aceptaNormativa: val.aceptaNormativa ? true : false
  };

  console.log('Enviando datos:', requestBody);

  this.visitantesService.preregistrarVisitante(requestBody).subscribe({
    next: (res) => {
      // El backend devuelve un mapa con la llave "mensaje"
      this.mensaje = res.mensaje || 'Solicitud enviada con éxito.';
      this.preregistroForm.reset();
      // Redirigir al login tras 3 segundos
      setTimeout(() => this.router.navigate(['/login']), 3000);
    },
    error: (err) => {
      // Capturamos el error que viene del Map.of("error", "...") del backend
      console.error('Error del servidor:', err);
      this.error = err.error?.error || 'Error al realizar el pre-registro. Verifique los datos.';
    }
  });
}

  onCancelar(): void {
    this.router.navigate(['/login']);
  }
}