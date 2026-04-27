import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validacion-qr-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-[60vh] text-center p-6">
      <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
        <p class="font-bold">Módulo en Desarrollo</p>
        <p>La función de generación y validación de códigos QR está pendiente.</p>
      </div>
      <h2 class="text-2xl font-semibold text-gray-600">Validación de Acceso QR</h2>
    </div>
  `
})
export class ValidacionQrPageComponent {}