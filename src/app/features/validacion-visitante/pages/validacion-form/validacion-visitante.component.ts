import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Importado de @angular/core
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// PrimeNG (Estos se mantienen igual)
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

// Tus modelos y servicios
import { SolicitudVisitante } from '../../models/validacion-visitante.models';
import { ValidacionVisitanteService } from '../../service/validacion-visitante.service';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-validacion-visitante',
  standalone: true, // Indica que no necesita un NgModule
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    TagModule, 
    RouterModule, 
    ToastModule, 
    ConfirmDialogModule,
    TooltipModule,
    CardModule // Asegúrate de que CardModule esté aquí para que <p-card> funcione
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './validacion-visitante.component.html',
  styleUrl: './validacion-visitante.component.scss'
})
export class ValidacionVisitanteComponent implements OnInit {
  solicitudes: SolicitudVisitante[] = [];
  solicitudesFiltradas: SolicitudVisitante[] = []; // Para el buscador
  loading: boolean = false;

  constructor(
    private validacionService: ValidacionVisitanteService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.validacionService.obtenerSolicitudes().subscribe({
      next: (res) => {
        this.solicitudes = res;
        this.solicitudesFiltradas = res; // Inicialmente son iguales
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo conectar'});
        this.loading = false;
      }
    });
  }

  // Lógica del buscador idéntica a Reos
  filtrarVisitantes(event: any): void {
    const valor = event.target.value.toLowerCase();
    this.solicitudesFiltradas = this.solicitudes.filter(s => 
      s.nombreCompleto.toLowerCase().includes(valor) || 
      s.dniNie.toLowerCase().includes(valor) ||
      s.nombreInterno.toLowerCase().includes(valor)
    );
  }

  confirmarCambio(solicitud: SolicitudVisitante, nuevoEstado: 'APROBADO' | 'RECHAZADO'): void {
    // Si ya tiene ese estado, solo avisamos
    if (solicitud.estado === nuevoEstado) {
      this.mostrarMensaje('info', 'Sin cambios', `La solicitud ya figura como ${nuevoEstado}`);
      return;
    }

    // Si NO está pendiente, pedimos confirmación para rectificar
    if (solicitud.estado !== 'PENDIENTE') {
      this.confirmationService.confirm({
        message: `Esta solicitud ya está ${solicitud.estado}. ¿Estás seguro de que deseas cambiarla a ${nuevoEstado}?`,
        header: 'Confirmar Rectificación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, cambiar',
        rejectLabel: 'Cancelar',
        accept: () => this.ejecutarCambio(solicitud, nuevoEstado)
      });
    } else {
      // Si está pendiente, cambiamos directo
      this.ejecutarCambio(solicitud, nuevoEstado);
    }
  }

  private ejecutarCambio(solicitud: SolicitudVisitante, nuevoEstado: 'APROBADO' | 'RECHAZADO'): void {
    this.validacionService.actualizarEstadoSolicitud(solicitud.id, nuevoEstado).subscribe({
      next: () => {
        solicitud.estado = nuevoEstado;
        this.mostrarMensaje('success', 'Éxito', `Solicitud ${nuevoEstado.toLowerCase()} correctamente`);
        this.cdRef.detectChanges();
      },
      error: () => {
        this.mostrarMensaje('error', 'Error', 'No se pudo actualizar en la base de datos');
      }
    });
  }

  mostrarMensaje(severidad: string, titulo: string, detalle: string) {
    this.messageService.add({ severity: severidad, summary: titulo, detail: detalle });
  }

  getSeverity(estado: string): "success" | "secondary" | "info" | "warn" | "danger" | undefined {
    switch (estado) {
      case 'APROBADO': return 'success';
      case 'PENDIENTE': return 'warn';
      case 'RECHAZADO': return 'danger';
      default: return 'info';
    }
  }
}