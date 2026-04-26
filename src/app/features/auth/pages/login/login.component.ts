import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const userLogueado = this.loginForm.value.username.toLowerCase().trim();
        const rolServidor = res.rol ? res.rol.toUpperCase() : '';

        // --- LÓGICA DE REDIRECCIÓN ACTUALIZADA ---
        if (userLogueado === 'admin' || rolServidor === 'ADMIN') {
          this.router.navigate(['/monitor']); 
        } 
        else if (rolServidor === 'VISITANTE') {
          this.router.navigate(['/visitas']);
        } 
        else if (userLogueado === 'guardia1' || rolServidor === 'GUARDIA') {
          // Ahora los guardias entran directamente a incidencias
          this.router.navigate(['/incidencias']); 
        } 
        else {
          // Por defecto al monitor
          this.router.navigate(['/monitor']);
        }
      }, // Fin del bloque next
      error: (err: any) => {
        this.isLoading = false;
        console.error('Login error:', err);
        
        if (err.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor.';
        } else {
          this.errorMessage = 'Ha ocurrido un error al iniciar sesión.';
        }
      }
    });
  }

  // Getters para las validaciones del HTML
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}