import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { IncidenciasService } from '../../service/incidencias.service';
import { ReoService } from '../../../reos/services/reos.service';

@Component({
  selector: 'app-incidencia-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    CardModule, 
    ButtonModule, 
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './incidencia-form.component.html',
  styleUrl: './incidencia-form.component.scss'
})
export class IncidenciaFormComponent implements OnInit {
  private incidenciaService = inject(IncidenciasService);
  private reoService = inject(ReoService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef); // Inyectamos el detector de cambios

  modoEditar: boolean = false;
  reos: any[] = []; 
  
  // Objeto inicial igualado a la estructura del formulario
  incidente: any = {
    id: null,
    tipo: '',
    descripcion: '',
    fechaHora: '', 
    idReo: null,
    idGuardia: 2
  };

  ngOnInit(): void {
    this.cargarReos();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.modoEditar = true;
      this.cargarIncidencia(id); // Llamada al método de carga siguiendo estilo "Reos"
    }
  }

  // MÉTODO PARA CARGAR DATOS EN EDICIÓN
  cargarIncidencia(id: number): void {
    this.incidenciaService.getIncidenciaById(id).subscribe({
      next: (res: any) => {
        // Mapeamos los campos y forzamos un objeto nuevo para refrescar la vista
        this.incidente = {
          id: res.id,
          tipo: res.tipo || '',
          descripcion: res.descripcion || '',
          // Formateo vital para que el input datetime-local lo reconozca
          fechaHora: res.fechaHora ? res.fechaHora.replace(' ', 'T').slice(0, 16) : '',
          idReo: res.reo ? res.reo.id : null,
          idGuardia: res.guardia ? res.guardia.id : null
        };
        
        // Forzamos a Angular a detectar los cambios inmediatamente
        this.cdr.detectChanges();
        console.log('Incidencia cargada para edición:', this.incidente);
      },
      error: (err) => {
        console.error('Error al obtener incidencia:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el registro' });
      }
    });
  }

  cargarReos(): void {
    this.reoService.obtener_todos().subscribe({
      next: (res) => {
        this.reos = res;  //aqui carga los reos
        this.cdr.detectChanges();
      },
      error: () => console.error('Error al cargar reos')
    });
  }

  guardar(): void {
    if (!this.incidente.tipo || !this.incidente.descripcion || !this.incidente.fechaHora || !this.incidente.idGuardia) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Faltan campos obligatorios' });
      return;
    }

    // Formateo de fecha para el backend de Java (yyyy-MM-dd HH:mm:ss)
    let fechaJava = this.incidente.fechaHora.replace('T', ' ');
    if (fechaJava.length === 16) fechaJava += ":00";

    const payload: any = {
      tipo: this.incidente.tipo,
      descripcion: this.incidente.descripcion,
      fechaHora: fechaJava,
      guardia: { id: Number(this.incidente.idGuardia) }
    };

    // Si hay un reo seleccionado, lo añadimos como objeto con su ID
    if (this.incidente.idReo && this.incidente.idReo !== "null") {
      payload.reo = { id: Number(this.incidente.idReo) };
    } else {
      payload.reo = null; // Para limpiar la relación si se desea
    }

    if (this.modoEditar) {
      payload.id = this.incidente.id;
      this.incidenciaService.modificacion_incidente(this.incidente.id, payload).subscribe({
        next: () => this.notificarExito('Reporte actualizado correctamente'),
        error: (err) => this.notificarError(err)
      });
    } else {
      this.incidenciaService.alta_incidente(payload).subscribe({
        next: () => this.notificarExito('Incidencia registrada correctamente'),
        error: (err) => this.notificarError(err)
      });
    }
  }

  private notificarExito(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Hecho', detail: msg });
    setTimeout(() => this.router.navigate(['/incidencias']), 1500);
  }

  private notificarError(err: any) {
    console.error('Error del servidor:', err);
    const errorMsg = err.error?.error || 'Error 400: Datos inválidos';
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
  }
}