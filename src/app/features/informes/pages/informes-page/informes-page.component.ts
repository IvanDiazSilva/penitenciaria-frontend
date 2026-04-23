import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InformesService } from '../../services/informes.service';

@Component({
  selector: 'app-informes-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informes-page.component.html',
  styleUrl: './informes-page.component.scss',
})
export class InformesPageComponent implements OnInit {
  resumenGeneral: any = null;
  loading = false;
  errorMessage = '';
  downloadingPdf = false;

  constructor(private informesService: InformesService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.informesService.obtenerResumenGeneral().subscribe({
      next: (data) => {
        this.resumenGeneral = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar informe:', err);
        this.errorMessage = 'No se pudo cargar el informe.';
        this.loading = false;
      }
    });
  }

  descargarPdf(): void {
    if (this.downloadingPdf) return;

    this.downloadingPdf = true;
    this.errorMessage = '';

    this.informesService.descargarInformePdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'informe.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.downloadingPdf = false;
      },
      error: (err) => {
        console.error('Error al descargar PDF:', err);
        this.errorMessage = 'No se pudo descargar el PDF.';
        this.downloadingPdf = false;
      }
    });
  }
}