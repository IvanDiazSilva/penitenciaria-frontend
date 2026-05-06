import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { VisitasService } from '../../services/visitas.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface RespuestaQR {
  valido: boolean;
  mensaje: string;
  visitante?: string; // Por si quieres mostrar el nombre
}

@Component({
  selector: 'app-validar-qr',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './validar-qr.component.html',
  styleUrls: ['./validar-qr.component.scss']
})
export class ValidarQrComponent implements OnInit, OnDestroy {
  mensaje: string = '';
  cargando: boolean = false;
  allowedFormats = [BarcodeFormat.QR_CODE];
  mostrarScanner: boolean = true;
  esValido: boolean = false;
  private isProcessing = false;
  private routerSubscription?: Subscription;

  constructor(
    private visitasService: VisitasService, 
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef 
  ) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.reiniciarEstado();
    });
  }

  ngOnInit(): void {
    this.reiniciarEstado();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onScanSuccess(result: string) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.zone.run(() => {
      this.cargando = true;
      this.mostrarScanner = false;
      this.mensaje = 'Validando en el sistema...';
      this.cdr.detectChanges(); 

      this.visitasService.validarQr({ qr: result }).subscribe({
        next: (res: any) => {
          const respuesta = res as RespuestaQR;
          this.esValido = respuesta.valido;
          
          // Mantenemos el mensaje que envía el servidor
          this.mensaje = respuesta.mensaje;
          
          this.cargando = false;
          this.isProcessing = false;
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          this.esValido = false;
          this.isProcessing = false;
          this.cargando = false;

          // RECUERDA: El motivo ("Ya escaneado", etc.) viene en err.error.mensaje
          this.mensaje = err.error?.mensaje || 'Error: El código QR no es válido o ha expirado';
          
          this.cdr.detectChanges(); 
        }
      });
    });
  }
  cancelarEscaneo() {
  this.zone.run(() => {
    this.mostrarScanner = false;
    this.mensaje = 'Validación cancelada por el guardia'; // Mensaje actualizado
    this.esValido = false; // Se muestra en rojo/error por ser una cancelación
    this.cargando = false;
    this.isProcessing = false;
    this.cdr.detectChanges();
  });
}

  reiniciar() {
    this.reiniciarEstado();
  }

  private reiniciarEstado() {
    this.zone.run(() => {
      this.mensaje = '';
      this.cargando = false;
      this.isProcessing = false;
      this.mostrarScanner = true;
      this.esValido = false;
      this.cdr.detectChanges(); 
    });
  }
}