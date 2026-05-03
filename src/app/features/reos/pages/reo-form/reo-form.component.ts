import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReoService } from '../../service/reo.service';
import { Reo } from '../../models/reo.model';

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
  isEditMode = false; 
  reoId: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private reoService: ReoService,
    public router: Router,
    private route: ActivatedRoute 
  ) {
    // Validación flexible: DNI (8N+1L), NIE (1L+7N+1L) o Pasaporte (Alfanumérico)
    this.reoForm = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', [
        Validators.required, 
        Validators.minLength(6), 
        Validators.maxLength(12),
        Validators.pattern('^[a-zA-Z0-9]+$') // Solo letras y números
      ]],
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
    this.reoService.getReoById(id).subscribe({
      next: (reo) => {
        this.reoForm.patchValue(reo);
      },
      error: (err) => {
        console.error('Error:', err.message);
        alert('No se pudo cargar la información del recluso.');
      }
    });
  }

  onSubmit(): void {
    if (this.reoForm.valid) {
      const reoData = this.reoForm.value;
      
      if (this.isEditMode && this.reoId) {
        this.reoService.modificacion_recluso(Number(this.reoId), reoData).subscribe({
          next: () => {
            alert('Expediente actualizado');
            this.router.navigate(['/reos']);
          },
          error: (err) => alert(err.message)
        });
      } else {
        this.reoService.alta_recluso(reoData).subscribe({
          next: () => {
            alert('Recluso registrado con éxito');
            this.router.navigate(['/reos']);
          },
          error: (err) => alert(err.message)
        });
      }
    } else {
      alert('Por favor, revisa los campos. El documento debe tener entre 6 y 12 caracteres.');
    }
  }
}