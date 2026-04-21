import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Añadimos ActivatedRoute
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
  isEditMode = false; // Nueva bandera para saber si editamos
  reoId: string | null = null; // Para guardar el ID que viene en la URL

  constructor(
    private fb: FormBuilder,
    private reoService: ReoService,
    public router: Router,
    private route: ActivatedRoute // Inyectamos la ruta activa
  ) {
    this.reoForm = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(9)]],
      delito: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // 1. Comprobamos si hay un ID en la ruta (definida como /reos/editar/:id)
    this.reoId = this.route.snapshot.paramMap.get('id');
    
    if (this.reoId) {
      this.isEditMode = true;
      this.cargarDatosReo(this.reoId);
    }
  }

  cargarDatosReo(id: string): void {
    // Aquí usamos el servicio que está haciendo tu compañero
    this.reoService.getReoById(id).subscribe({
      next: (reo) => {
        // Rellenamos el formulario con los datos que nos trae Java
        this.reoForm.patchValue(reo);
      },
      error: (err) => console.error('Error al cargar datos:', err)
    });
  }

  onSubmit(): void {
    if (this.reoForm.valid) {
      if (this.isEditMode) {
        // MODO EDICIÓN: Llamamos a actualizar
        this.reoService.updateReo(this.reoId!, this.reoForm.value).subscribe({
          next: () => {
            console.log('Reo actualizado con éxito');
            this.router.navigate(['/reos']);
          },
          error: (err) => console.error('Error al actualizar:', err)
        });
      } else {
        // MODO CREACIÓN: Lo que ya tenías hecho
        this.reoService.createReo(this.reoForm.value).subscribe({
          next: () => {
            console.log('Reo creado con éxito');
            this.router.navigate(['/reos']);
          },
          error: (err) => console.error('Error al crear:', err)
        });
      }
    }
  }
}