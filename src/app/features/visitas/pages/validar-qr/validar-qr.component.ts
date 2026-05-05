import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { VisitasService } from '../../services/visitas.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-validar-qr',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './validar-qr.component.html',
  styleUrls: ['./validar-qr.component.scss']
})
export class ValidarQrComponent {
  allowedFormats = [BarcodeFormat.QR_CODE];
  scannerEnabled = true;
  isProcessing = false;
  mensaje = '';
  public tipoMensaje: 'success' | 'error' | 'info' | '' = '';

  constructor(private visitasService: VisitasService) {}

  onScanSuccess(result: string) {
  if (this.isProcessing || !this.scannerEnabled) return;

  this.isProcessing = true;
  this.scannerEnabled = false;
  this.mensaje = 'Consultando sistema...';
  

  this.visitasService.validarQr(result).pipe(
    finalize(() => {
      // ESTO SE EJECUTA SIEMPRE: Detiene el estado de carga
      this.isProcessing = false; 
    })
  ).subscribe({
    next: (res) => {
      if (res.valido) {
        this.mensaje = '✅ ACCESO PERMITIDO: ' + (res.visitante || 'Autorizado');
        this.tipoMensaje = 'success';
      } else {
        this.mensaje = '❌ ' + (res.mensaje || 'QR no válido');
        this.tipoMensaje = 'error';
      }
    },
    error: (err) => {
      // Si el interceptor añade el token pero no hay respuesta, 
      // el timeout de arriba nos mandará aquí.
      this.mensaje = '❌ Sin respuesta del servidor (Timeout)';
      this.tipoMensaje = 'error';
    }
  });
}

  // Dentro de tu clase ValidarQrComponent
public cancelarEscaneo() {
  this.scannerEnabled = false; // Apaga la cámara
  this.mensaje = 'Escaneo cancelado por el usuario';
  this.tipoMensaje = 'info'; // Un color neutro
}

public resetScanner() {
  this.mensaje = '';
  this.tipoMensaje = '';
  this.isProcessing = false;
  this.scannerEnabled = true; // Vuelve a encender la cámara
}
  
}