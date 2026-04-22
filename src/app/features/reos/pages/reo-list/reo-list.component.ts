import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReosService } from '../../services/reos.service';
import { Reo } from '../../models/reo.model';

@Component({
  selector: 'app-reo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reo-list.component.html',
  styleUrls: ['./reo-list.component.scss']
})
export class ReoListComponent implements OnInit {
  reos: Reo[] = [];
  loading = true;

  private reosService = inject(ReosService);
  private router = inject(Router);

  ngOnInit(): void {
    this.obtenerReos();
  }

  obtenerReos(): void {
    this.loading = true;
    this.reosService.getReos().subscribe({
      next: (data) => {
        this.reos = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar reos:', err);
        this.loading = false;
      }
    });
  }

  irANuevoReo(): void {
    this.router.navigate(['/reos/nuevo']);
  }

  editar(reo: Reo): void {
    this.router.navigate(['/reos/editar', reo.id]);
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este reo?')) {
      this.reosService.eliminarReo(id).subscribe({
        next: () => {
          this.obtenerReos();
        },
        error: (err: any) => {
          console.error('No se pudo eliminar el reo', err);
        }
      });
    }
  }
}