import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';

import { VisitantesService } from '../../services/visitantes.service';
import { PreregistroVisitanteRequest } from '../../models/preregistro-visitante.request';

@Component({
  selector: 'app-preregistro-visitante',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
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
export class PreregistroVisitanteComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private visitantesService = inject(VisitantesService);
  private router = inject(Router);

  mensaje = '';
  error = '';
  loading = false;
  private redirectTimeout?: ReturnType<typeof setTimeout>;

  preregistroForm = this.fb.group({
    nombreCompleto: ['', [Validators.required]],
    dniNie: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    nacionalidad: [''],
    telefono: [''],
    email: ['', [Validators.email]],
    direccion: [''],
    parentesco: [''],
    aceptaNormativa: [false, [Validators.requiredTrue]]
  });

  onSubmit(): void {
    this.mensaje = '';
    this.error = '';

    if (this.preregistroForm.invalid) {
      this.preregistroForm.markAllAsTouched();
      return;
    }

    const formValue = this.preregistroForm.getRawValue();

    const requestBody: PreregistroVisitanteRequest = {
      nombreCompleto: formValue.nombreCompleto?.trim() ?? '',
      dniNie: formValue.dniNie?.trim() ?? '',
      password: formValue.password ?? '',
      nacionalidad: formValue.nacionalidad?.trim() || undefined,
      telefono: formValue.telefono?.trim() || undefined,
      email: formValue.email?.trim() || undefined,
      direccion: formValue.direccion?.trim() || undefined,
      parentesco: formValue.parentesco?.trim() || undefined,
      aceptaNormativa: !!formValue.aceptaNormativa
    };

    this.loading = true;

    this.visitantesService.preregistrarVisitante(requestBody).subscribe({
      next: (res) => {
        this.loading = false;
        this.mensaje = res.mensaje || 'Solicitud enviada con éxito.';

        this.preregistroForm.reset({
          nombreCompleto: '',
          dniNie: '',
          password: '',
          nacionalidad: '',
          telefono: '',
          email: '',
          direccion: '',
          parentesco: '',
          aceptaNormativa: false
        });

        this.redirectTimeout = setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.error ||
          err?.error?.mensaje ||
          'Error al realizar el preregistro. Verifica los datos e inténtalo de nuevo.';
      }
    });
  }

  onCancelar(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
    }
  }
}