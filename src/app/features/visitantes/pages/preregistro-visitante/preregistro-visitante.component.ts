import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { VisitantesPublicService } from '../../services/visitantes-public.service';

@Component({
  selector: 'app-preregistro-visitante',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './preregistro-visitante.component.html',
  styleUrls: ['./preregistro-visitante.component.scss']
})
export class PreregistroVisitanteComponent {
  form: FormGroup;
  enviado = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private visitantesPublicService: VisitantesPublicService
  ) {
    this.form = this.fb.group({
      dniNie: ['', [Validators.required, Validators.minLength(9)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error = '';
    this.enviado = false;

    this.visitantesPublicService.preregistrarVisitante(this.form.value).subscribe({
      next: () => {
        this.enviado = true;
        this.form.reset();
      },
      error: (err: any) => {
        console.error('Error al preregistrar visitante:', err);
        this.error = 'No se pudo enviar el preregistro.';
      }
    });
  }
}