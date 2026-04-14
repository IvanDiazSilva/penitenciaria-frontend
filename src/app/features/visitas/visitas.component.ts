import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.services';
import { Visita } from '../../core/models/visita.model';

@Component({
  selector: 'app-visitas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss']
})
export class VisitasComponent implements OnInit {

  visitas: Visita[] = [];
  loading = true;
  errorMsg: string | null = null;

  private http = inject(HttpClient);
  private cd = inject(ChangeDetectorRef);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('=== VISITAS INIT ===');
    this.loading = true;
    this.errorMsg = null;

    this.http.get<Visita[]>('http://localhost:8080/penitenciaria-api/api/visitas').subscribe({
      next: (data) => {
        console.log('Visitas cargadas:', data);
        this.visitas = data;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar visitas:', error);
        this.errorMsg = 'No se pudieron cargar las visitas';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}