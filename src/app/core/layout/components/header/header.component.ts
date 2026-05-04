import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  get rol(): string {
    return this.authService.getRol() ?? 'SIN ROL';
  }

  logout(): void {
    this.authService.logout();
  }
}