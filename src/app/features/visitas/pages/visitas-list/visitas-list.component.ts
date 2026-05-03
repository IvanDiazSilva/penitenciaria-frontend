import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VisitaService } from '../../services/visita.service';

@Component({
  selector: 'app-visitas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitas-list.component.html',
  styleUrls: ['./visitas-list.component.scss']
})
export class VisitasListComponent implements OnInit {
  // Usamos 'any[]' para que PrimeNG o tu tabla no den error si los campos 
  // del Backend (fechaVisita) no coinciden exactamente con tu interfaz .model
  visitas: any[] = [];
  loading: boolean = true;

  private visitaService = inject(VisitaService);
  private router = inject(Router);

  ngOnInit(): void {
    this.obtenerVisitas();
  }

  obtenerVisitas(): void {
    this.loading = true;
    this.visitaService.getAllVisitas().subscribe({
      next: (data) => {
        console.log('Datos recibidos de la API:', data);
        this.visitas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar visitas:', err);
        this.loading = false;
        // Alerta por si el servidor de Iván está caído o el Token expiró
        if(err.status === 401) {
          alert('Tu sesión ha expirado, por favor vuelve a entrar.');
        }
      }
    });
  }

  irANuevaVisita(): void {
    this.router.navigate(['/visitas/nueva']);
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
      this.visitaService.deleteVisita(id).subscribe({
        next: () => {
          this.obtenerVisitas();
        },
        error: (err) => {
          console.error('Error al borrar:', err);
          alert('No tienes permisos para eliminar visitas (Solo ADMIN).');
        }
      });
    }
  }

  editar(visita: any): void {
    this.router.navigate(['/visitas/editar', visita.id]);
  }
}