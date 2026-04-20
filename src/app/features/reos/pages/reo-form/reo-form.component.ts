import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReoService } from '../../../../core/services/reo.services';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-reo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './reo-form.component.html',
  styleUrl: './reo-form.component.scss'
})
export class ReoFormComponent implements OnInit {
  reoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reoService: ReoService,
    private router: Router
  ) {
    // Definimos los campos que espera tu API de Java
    this.reoForm = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(9)]],
      delito: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.reoForm.valid) {
      this.reoService.createReo(this.reoForm.value).subscribe({
        next: () => {
          console.log('Reo creado con éxito');
          this.router.navigate(['/reos']); // Volvemos a la lista
        },
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }
}