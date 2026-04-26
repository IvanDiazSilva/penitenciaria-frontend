import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { Visitante } from '../../models/visitante.model';
import { VisitantesService } from '../../services/visitantes.service';

@Component({
  selector: 'app-validacion-visitante',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule
  ],
  templateUrl: './validacion-visitante.component.html',
  styleUrls: ['./validacion-visitante.component.scss']
})
export class ValidacionVisitanteComponent implements OnInit {
  visitantes: Visitante[] = [];
  cargando = false;

  constructor(private visitantesService: VisitantesService) { }

  ngOnInit(): void {
    this.cargarVisitantes();
  }

  cargarVisitantes(): void {
    this.cargando = true;

    this.visitantesService.getVisitantes().subscribe({
      next: (data: Visitante[]) => {
        this.visitantes = data;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar visitantes:', err);
        this.cargando = false;
      }
    });
  }


  getSeverity(
    estado: string | undefined
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (estado) {
      case 'APROBADO':
        return 'success';
      case 'PENDIENTE':
        return 'warn';
      case 'DENEGADO':
        return 'danger';
      default:
        return 'info';
    }
  }

  aprobar(visitante: Visitante): void {
    if (!visitante.id) return;

    this.visitantesService.aprobarVisitante(visitante.id).subscribe({
      next: () => this.cargarVisitantes(),
      error: (err: any) => console.error('Error al aprobar visitante:', err)
    });
  }

  denegar(visitante: Visitante): void {
    if (!visitante.id) return;

    this.visitantesService.denegarVisitante(visitante.id).subscribe({
      next: () => this.cargarVisitantes(),
      error: (err: any) => console.error('Error al denegar visitante:', err)
    });
  }
}