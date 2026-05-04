import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReoService } from '../../service/reo.service';
import { Reo } from '../../models/reo.model';

// PrimeNG
import { TableModule } from 'primeng/table';
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
    ReoDialogComponent // 🔥 IMPORTANTE
  ],
  templateUrl: './reo-list.component.html',
  styleUrls: ['./reo-list.component.scss']
})
export class ReoListComponent implements OnInit {

  reos: Reo[] = [];
  reosFiltrados: Reo[] = [];

  // 🔥 CONTROL DEL DIALOG
  dialogVisible = false;
  reoSeleccionadoId: number | null = null;

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
        this.reos = data;
        this.reosFiltrados = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar reos:', err.message);
      }
    });
  }

  // 🔍 FILTRO
  filtrarReclusos(event: any): void {
    const valor = event.target.value.toLowerCase().trim();

    if (!valor) {
      this.reosFiltrados = [...this.reos];
      return;
    }

    this.reosFiltrados = this.reos.filter(reo =>
      reo.id?.toString().includes(valor) ||
      reo.nombre.toLowerCase().includes(valor) ||
      reo.apellido?.toLowerCase().includes(valor) ||
      reo.dni.toLowerCase().includes(valor)
    );
  }

  // ➕ NUEVO
  abrirNuevo(): void {
    this.reoSeleccionadoId = null;
    this.dialogVisible = true;
  }

  // ✏️ EDITAR
  editarReo(reo: Reo): void {
    this.reoSeleccionadoId = reo.id;
    this.dialogVisible = true;
  }

  // ❌ ELIMINAR
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

  // 🔄 REFRESCO TRAS GUARDAR
  onGuardado(): void {
    this.dialogVisible = false;
    this.cargarDatos();
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
  }
}