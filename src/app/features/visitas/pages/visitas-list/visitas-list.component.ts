import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VisitaService } from '../../services/visita.service';
import { Visita } from '../../models/visita.model';
import { TableModule } from "primeng/table";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-visitas-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule ],
  templateUrl: './visitas-list.component.html',
  styleUrls: ['./visitas-list.component.scss']
})
export class VisitasListComponent implements OnInit {
  // Lista donde guardaremos lo que venga de la API
  visitas: Visita[] = [];
  loading: boolean = true;

  // Inyectamos el servicio y el router
  private visitaService = inject(VisitaService);
  private router = inject(Router);

  ngOnInit(): void {
    this.obtenerVisitas();
  }

  obtenerVisitas(): void {
    this.loading = true;
    this.visitaService.getAllVisitas().subscribe({
      next: (data) => {
        this.visitas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar visitas:', err);
        this.loading = false;
        // Aquí podrías poner una alerta si la API de Iván falla
      }
    });
  }

  // Función para ir a la página del formulario (visitas-form)
  irANuevaVisita(): void {
    this.router.navigate(['/visitas/nueva']);
  }

  // Función para borrar una visita
  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta solicitud de visita?')) {
      this.visitaService.deleteVisita(id).subscribe({
        next: () => {
          // Refrescamos la lista después de borrar
          this.obtenerVisitas();
        },
        error: (err) => alert('No se pudo eliminar la visita')
      });
    }
  }

  // Opcional: Para el botón de editar (si decides implementarlo)
  editar(visita: Visita): void {
    // Podrías pasar el ID por la URL
    this.router.navigate(['/visitas/editar', visita.id]);
  }
}