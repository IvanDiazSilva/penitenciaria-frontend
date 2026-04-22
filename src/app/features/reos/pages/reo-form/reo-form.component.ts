import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReosService } from '../../services/reos.service';

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
  styleUrls: ['./reo-form.component.scss']
})
export class ReoFormComponent implements OnInit {
  reoForm: FormGroup;
  isEditMode = false;
  reoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reosService: ReosService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.reoForm = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(9)]],
      delito: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.reoId = this.route.snapshot.paramMap.get('id');

    if (this.reoId) {
      this.isEditMode = true;
      this.cargarDatosReo(this.reoId);
    }
  }

  cargarDatosReo(id: string): void {
    const idNumber = parseInt(id, 10);

    this.reosService.getReoById(idNumber).subscribe({
      next: (reo) => {
        this.reoForm.patchValue(reo);
      },
      error: (err: any) => {
        console.error('Error al cargar datos:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.reoForm.valid) {
      if (this.isEditMode) {
        const idNumber = parseInt(this.reoId!, 10);

        this.reosService.actualizarReo(idNumber, this.reoForm.value).subscribe({
          next: () => {
            console.log('Reo actualizado con éxito');
            this.router.navigate(['/reos']);
          },
          error: (err: any) => {
            console.error('Error al actualizar:', err);
          }
        });
      } else {
        this.reosService.crearReo(this.reoForm.value).subscribe({
          next: () => {
            console.log('Reo creado con éxito');
            this.router.navigate(['/reos']);
          },
          error: (err: any) => {
            console.error('Error al crear:', err);
          }
        });
      }
    }
  }
}