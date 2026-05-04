import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReoService } from '../../services/reos.service';
import {Reo} from '../../models/reo.model'

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
    this.reoForm = this.fb.group({
      nombre: ['', Validators.required],
      // Validamos que el DNI tenga formato mínimo para no enviar basura a la BD
      dni: ['', [Validators.required, Validators.minLength(9)]],
      delito: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Capturamos el ID de la URL para saber si estamos editando o creando
    this.reoId = this.route.snapshot.paramMap.get('id');
    
    if (this.reoId) {
      this.isEditMode = true;
      this.cargarDatosReo(this.reoId);
    }
  }

  /**
   * CONSULTA A BD: Recupera un recluso por su ID para editarlo.
   */
  cargarDatosReo(id: string): void {
    this.reoService.getReoById(id).subscribe({
      next: (reo) => {
        // Sincronizamos los datos de la BD con los campos del formulario
        this.reoForm.patchValue(reo);
        console.log('Datos del recluso recuperados con éxito');
      },
      error: (err) => {
        console.error('No se pudo obtener el reo:', err.message);
        alert('Error: No se pudo cargar la información del recluso.');
      }
    });
  }

  /**
   * ENVÍO DE DATOS (ALTA O MODIFICACIÓN)
   * Gestiona la conexión final con la base de datos según el modo.
   */
  onSubmit(): void {
    if (this.reoForm.valid) {
      if (this.isEditMode && this.reoId) {
        
        // --- CASO DE USO: MODIFICACIÓN ---
        this.reoService.modificacion_recluso(Number(this.reoId), this.reoForm.value).subscribe({
          next: () => {
            console.log('Actualización confirmada en Base de Datos');
            alert('Datos actualizados correctamente');
            this.router.navigate(['/reos']);
          },
          error: (err) => {
            // Aquí capturamos el mensaje de DNI duplicado o error de BD
            alert(err.message);
          }
        });

      } else {
        
        // --- CASO DE USO: ALTA ---
        this.reoService.alta_recluso(this.reoForm.value).subscribe({
          next: () => {
            console.log('Inserción confirmada en Base de Datos');
            alert('Recluso registrado con éxito');
            this.router.navigate(['/reos']);
          },
          error: (err) => {
            // El servicio nos devuelve un error amigable si el DNI ya existe
            alert(err.message);
          }
        });
      }
    } else {
      alert('Por favor, rellene todos los campos obligatorios.');
    }
  }
}