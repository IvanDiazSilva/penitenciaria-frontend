import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitasService } from '../../services/visitas.service';
import { Visita } from '../../models/visitas.model';

@Component({
  selector: 'app-visitas-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitas-form.component.html',
  styleUrls: ['./visitas-form.component.scss']
})
export class VisitasFormComponent {
  private visitasService = inject(VisitasService);
  private router = inject(Router);

  nuevaVisita: Visita = {
    reo: {
      id: 0
    },
    visitanteNombre: '',
    visitanteDni: '',
    fechaVisita: '',
    horaEntrada: '',
    horaSalida: '',
    autorizado: false,
    codigoQr: null
  };

  guardar(): void {
    this.visitasService.crearVisita(this.nuevaVisita).subscribe({
      next: () => {
        alert('Solicitud de visita enviada correctamente');
        this.router.navigate(['/visitas']);
      },
      error: (err: any) => {
        console.error('Error al guardar:', err);
        alert('Hubo un error al conectar con el servidor de Iván');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/visitas']);
  }
}