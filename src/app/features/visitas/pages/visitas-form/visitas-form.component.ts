import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { VisitasService } from '../../services/visitas.service';
import { ReoService } from '../../../reos/services/reos.service';
import { CrearVisitaRequest } from '../../models/crear-visita.request';
import { Reo } from '../../../reos/models/reo.model';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-visitas-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitas-form.component.html',
  styleUrls: ['./visitas-form.component.scss']
})
export class VisitasFormComponent implements OnInit {
  private visitasService = inject(VisitasService);
  private reoService    = inject(ReoService);
  private authService   = inject(AuthService);
  private router        = inject(Router);
  private cdr           = inject(ChangeDetectorRef); // ← AÑADIDO

  nombreVisitante  = 'Visitante autenticado';
  reos: Reo[]          = [];
  reosFiltrados: Reo[] = [];
  terminoBusqueda      = '';

  cargandoReos = false;
  guardando    = false;

  nuevaVisita: CrearVisitaRequest = {
    reoId:       0,
    fechaVisita: '',
    horaEntrada: null,
    horaSalida:  null
  };

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.nombreVisitante = user?.username ?? 'Visitante autenticado';
    this.cargarReos();
  }

  cargarReos(): void {
    this.cargandoReos = true;

    this.reoService.obtener_todos().subscribe({
      next: (data: Reo[]) => {
        this.reos        = data ?? [];
        this.cargandoReos = false;

        // ✅ Si el usuario ya había escrito algo mientras cargaba, filtramos ahora
        if (this.terminoBusqueda.trim()) {
          this.buscarReo();
        }

        this.cdr.detectChanges(); // ← fuerza actualización de la vista
      },
      error: (err: any) => {
        console.error('Error cargando reos:', err);
        this.cargandoReos = false;
        this.cdr.detectChanges();
        alert('No se pudieron cargar los internos: ' + err.message);
      }
    });
  }

  buscarReo(): void {
    const busqueda = this.terminoBusqueda.toLowerCase().trim();

    if (!busqueda) {
      this.reosFiltrados = [];
      return;
    }

    this.reosFiltrados = this.reos
      .filter(reo => {
        const nombre = (reo.nombre ?? '').toLowerCase();
        const dni    = (reo.dni    ?? '').toLowerCase();
        return nombre.includes(busqueda) || dni.includes(busqueda);
      })
      .slice(0, 10);
  }

  seleccionarReo(reo: Reo): void {
    this.nuevaVisita.reoId  = reo.id;
    this.terminoBusqueda    = `${reo.nombre} (${reo.dni})`;
    this.reosFiltrados      = [];
  }

  limpiarSeleccion(): void {
    this.nuevaVisita.reoId = 0;
    this.terminoBusqueda   = '';
    this.reosFiltrados     = [];
  }

  guardar(): void {
    if (this.nuevaVisita.reoId <= 0) {
      alert('Debes seleccionar un interno');
      return;
    }
    if (!this.nuevaVisita.fechaVisita) {
      alert('Debes indicar la fecha de la visita');
      return;
    }

    this.guardando = true;

    this.visitasService.crearVisita(this.nuevaVisita).subscribe({
      next: () => {
        this.guardando = false;
        alert('Solicitud de visita enviada correctamente');
        this.router.navigate(['/visitante/mis-visitas']);
      },
      error: (err: any) => {
        console.error('Error al guardar:', err);
        this.guardando = false;
        alert('Hubo un error al guardar la visita');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/visitante/mis-visitas']);
  }
}