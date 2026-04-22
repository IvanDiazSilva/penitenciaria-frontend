import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VisitasService } from '../../services/visitas.service';
import { Visita } from '../../models/visitas.model';

@Component({
  selector: 'app-visitas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitas-list.component.html',
  styleUrls: ['./visitas-list.component.scss']
})
export class VisitasListComponent implements OnInit {
  visitas: Visita[] = [];
  loading = true;

  private visitasService = inject(VisitasService);
  private router = inject(Router);

  ngOnInit(): void {
    this.obtenerVisitas();
  }

  obtenerVisitas(): void {
    this.loading = true;
    this.visitasService.getVisitas().subscribe({
      next: (data) => {
        this.visitas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar visitas:', err);
        this.loading = false;
      }
    });
  }

  irANuevaVisita(): void {
    this.router.navigate(['/visitas/nueva']);
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta visita?')) {
      this.visitasService.eliminarVisita(id).subscribe({
        next: () => {
          this.obtenerVisitas();
        },
        error: (err) => {
          console.error('No se pudo eliminar la visita', err);
        }
      });
    }
  }

  editar(visita: Visita): void {
    this.router.navigate(['/visitas/editar', visita.id]);
  }
}