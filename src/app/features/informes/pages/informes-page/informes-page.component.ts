import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { InformesService } from '../../services/informes.service';

@Component({
  selector: 'app-informes-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informes-page.component.html',
  styleUrls: ['./informes-page.component.scss']
})
export class InformesPageComponent implements OnInit {
  resumenGeneral: any = null;
  loading = false;
  errorMessage = '';

  constructor(private informesService: InformesService) {}

  ngOnInit(): void {
    console.log('NGONINIT INFORMES PAGE');
    this.cargarResumen();
  }

  cargarResumen(): void {
    console.log('INICIO CARGA RESUMEN');
    this.loading = true;
    this.errorMessage = '';
    this.resumenGeneral = null;

    this.informesService.obtenerResumenGeneral()
      .pipe(
        finalize(() => {
          console.log('FIN CARGA RESUMEN');
          this.loading = false;
        })
      )
      .subscribe({
        next: (data) => {
          console.log('RESPUESTA INFORME OK =>', data);
          this.resumenGeneral = data;
        },
        error: (err) => {
          console.error('RESPUESTA INFORME ERROR =>', err);
          this.errorMessage = 'No se pudo cargar el resumen.';
        }
      });
  }

  descargarPdf(): void {
    this.informesService.descargarInformePdf().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'informe.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('PDF ERROR =>', err);
      }
    });
  }
}