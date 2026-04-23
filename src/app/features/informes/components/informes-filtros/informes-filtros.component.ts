import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-informes-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './informes-filtros.component.html',
  styleUrl: './informes-filtros.component.scss',
})
export class InformesFiltrosComponent {
  fecha: string = '';
  tipo: string = 'general';

  @Output() aplicarFiltros = new EventEmitter<{ fecha: string; tipo: string }>();

  onAplicarFiltros(): void {
    this.aplicarFiltros.emit({
      fecha: this.fecha,
      tipo: this.tipo
    });
  }
  

  limpiarFiltros(): void {
    this.fecha = '';
    this.tipo = 'general';

    this.aplicarFiltros.emit({
      fecha: this.fecha,
      tipo: this.tipo
    });
  }
}