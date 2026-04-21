import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SolicitudVisitante } from '../../../../core/models/visitante.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-validacion-visitante',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, TooltipModule, TagModule, RouterModule],
  templateUrl: './validacion-visitante.component.html',
  styleUrl: './validacion-visitante.component.scss'
})
export class ValidacionVisitanteComponent implements OnInit {
  solicitudes: SolicitudVisitante[] = [];

  ngOnInit(): void {
    // Datos de prueba (Hardcoded) hasta conectar con el servicio de Iván en core
    this.solicitudes = [
      { id: 1, nombreCompleto: 'Laura Martínez', dniNie: '44555666K', email: 'laura@email.com', telefono: '600111222', nombreInterno: 'Juan Pérez', parentesco: 'Hermana', estado: 'PENDIENTE' },
      { id: 2, nombreCompleto: 'Pedro Gómez', dniNie: '11222333L', email: 'pedro@email.com', telefono: '600333444', nombreInterno: 'Juan Pérez', parentesco: 'Abogado', estado: 'PENDIENTE' }
    ];
  }

 // En tu validacion-visitante.component.ts

getSeverity(estado: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
  switch (estado) {
    case 'APROBADO':
      return 'success';
    case 'PENDIENTE':
      return 'warn';   // <-- Antes decía 'warning', cámbialo a 'warn'
    case 'RECHAZADO':
      return 'danger';
    default:
      return 'info';
  }
}

  cambiarEstado(solicitud: SolicitudVisitante, nuevoEstado: 'APROBADO' | 'RECHAZADO') {
    solicitud.estado = nuevoEstado;
    console.log(`Solicitud de ${solicitud.nombreCompleto} marcada como ${nuevoEstado}`);
    // Aquí llamarás a: this.visitanteService.updateEstado(solicitud.id, nuevoEstado).subscribe();
  }
}