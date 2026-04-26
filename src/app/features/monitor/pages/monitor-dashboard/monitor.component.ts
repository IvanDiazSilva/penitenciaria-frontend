import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
// 1. Asegúrate de importar ButtonModule y RippleModule
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';


@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [CommonModule,RouterModule, ButtonModule,RippleModule],
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {
  data: any = null;
  loading = true;
  errorMsg: string | null = null;

  private http = inject(HttpClient);
  private cd = inject(ChangeDetectorRef);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('=== MONITOR INIT ===');
    this.loading = true;
    this.errorMsg = null;

    this.http.get('http://localhost:8080/penitenciaria-api/api/monitor').subscribe({
      next: (response) => {
        console.log('Monitor response:', response);
        this.data = response;
        this.loading = false;
        console.log('loading final:', this.loading);
        this.cd.detectChanges();   // ← Fuerza actualización de la vista
      },
      error: (error) => {
        console.error('Error monitor:', error);
        this.errorMsg = 'No se pudieron cargar los datos del monitor';
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