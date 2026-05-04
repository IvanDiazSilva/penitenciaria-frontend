import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { VisitasService } from '../../services/visitas.service';

@Component({
  selector: 'app-validar-qr',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './validar-qr.component.html',
  styleUrls: ['./validar-qr.component.scss']
})
export class ValidarQrComponent {
  scanResult: string = '';
  mensaje: string = '';
  allowedFormats = [BarcodeFormat.QR_CODE];
  
  // Flag para evitar múltiples llamadas al mismo QR
  private isProcessing = false;

  constructor(private visitasService: VisitasService) {}

  onScanSuccess(result: string) {
    // Si ya estamos procesando o es el mismo, no hacemos nada
    if (this.isProcessing || this.scanResult === result) return;

    this.scanResult = result;
    this.isProcessing = true;
    this.mensaje = 'Validando...';

    this.visitasService.validarQr({ qr: result }).subscribe({
      next: (res) => {
        this.mensaje = 'Acceso concedido: ' + res.visitante;
        this.isProcessing = false;
        // Limpiamos tras 3 segundos para permitir escanear a otro
        setTimeout(() => this.limpiar(), 3000);
      },
      error: (err) => {
        this.mensaje = 'Error: ' + (err.error?.mensaje || 'QR no válido');
        this.isProcessing = false;
        setTimeout(() => this.limpiar(), 3000);
      }
    });
  }

  private limpiar() {
    this.scanResult = '';
    this.mensaje = '';
  }
}