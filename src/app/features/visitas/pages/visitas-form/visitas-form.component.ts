import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitaService } from '../../services/visitas.service';
import { VisitantesService } from '../../../visitantes/services/visitantes.service';
import { Visita } from '../../models/visita.model';

@Component({
  selector: 'app-visitas-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitas-form.component.html',
  styleUrls: ['./visitas-form.component.scss']
})
export class VisitasFormComponent {
  private visitaService = inject(VisitaService);
  private router = inject(Router);

  // Creamos un objeto vacío basado en tu modelo
  nuevaVisita: Visita = {
    id: 0,
    reo_id: 0,
    visitante_nombre: 'Estefanía García', // Datos por defecto del usuario logueado
    visitante_dni: '12345678X',
    fecha_visita: '',
    hora_entrada: null,
    hora_salida: null,
    autorizado: false,
    codigo_qr: ''
  };

  guardar() {
    this.visitaService.crearVisita(this.nuevaVisita).subscribe({
      next: () => {
        alert('Solicitud de visita enviada correctamente');
        this.router.navigate(['/visitas']); // Cuando guarda, te manda de vuelta a la lista
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Hubo un error al conectar con el servidor de Iván');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/visitas']);
  }
}