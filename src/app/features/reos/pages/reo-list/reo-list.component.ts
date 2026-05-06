import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReoService } from '../../service/reo.service';
import { Reo } from '../../models/reo.model';

// PrimeNG
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

// Dialog
import { ReoDialogComponent } from '../../reo-dialog/reo-dialog';

@Component({
  selector: 'app-reo-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    CardModule,
    InputTextModule,
    ReoDialogComponent
  ],
  templateUrl: './reo-list.component.html',
  styleUrls: ['./reo-list.component.scss']
})
export class ReoListComponent implements OnInit {
  reos: Reo[] = [];

  dialogVisible = false;
  reoSeleccionadoId: number | null = null;

  @ViewChild('dt') dt!: Table;

  constructor(
    private reoService: ReoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.reoService.obtener_todos().subscribe({
      next: (data) => {
        this.reos = data ?? [];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar reos:', err.message);
      }
    });
  }

  filtrarReclusos(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(valor, 'contains');
  }

  abrirNuevo(): void {
    this.reoSeleccionadoId = null;
    this.dialogVisible = true;
  }

  editarReo(reo: Reo): void {
    this.reoSeleccionadoId = reo.id;
    this.dialogVisible = true;
  }

  confirmarEliminar(reo: Reo): void {
    const mensaje = `¿Dar de baja a ${reo.nombre}?`;

    if (confirm(mensaje)) {
      this.reoService.baja_recluso(reo.id).subscribe({
        next: () => {
          alert('Reo eliminado');
          this.cargarDatos();
        },
        error: (err) => alert(err.message)
      });
    }
  }

  onGuardado(): void {
    this.dialogVisible = false;
    this.cargarDatos();
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.reoSeleccionadoId = null;
  }
}