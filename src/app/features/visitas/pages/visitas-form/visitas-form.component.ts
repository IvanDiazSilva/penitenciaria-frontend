import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitaService } from '../../services/visita.service';

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

  // Ajustamos el objeto para que coincida EXACTAMENTE con Visita.java del Backend
  nuevaVisita: any = {
    fechaVisita: '', // En Java: private LocalDate fechaVisita
    horaEntrada: null,
    horaSalida: null,
    autorizado: true,
    // Java espera objetos, no IDs sueltos
    reo: { 
      id: null 
    }, 
    visitante: { 
      id: 2 // Aquí deberías usar el ID del usuario logueado
    }
  };

  guardar() {
    if (!this.nuevaVisita.fechaVisita || !this.nuevaVisita.reo.id) {
      alert('Por favor, completa la fecha y selecciona un reo');
      return;
    }

    // Al poner ': any', TypeScript dejará de marcar errores en rojo
    const payload: any = {
      fechaVisita: new Date(this.nuevaVisita.fechaVisita).toISOString().split('T')[0],
      autorizado: this.nuevaVisita.autorizado,
      reo: { id: Number(this.nuevaVisita.reo.id) },
      visitante: { id: Number(this.nuevaVisita.visitante.id) }
    };

    console.log('Enviando datos:', payload);

    this.visitaService.createVisita(payload).subscribe({
      next: () => {
        alert('Solicitud enviada');
        this.router.navigate(['/visitas']);
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al guardar');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/visitas']);
  }
}