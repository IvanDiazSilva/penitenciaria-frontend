import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

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
      next: () => {
        this.isLoading = false;
        
        // Obtenemos el rol para decidir a dónde mandar a cada uno
        const rol = this.authService.getRol();

        if (rol === 'ADMIN') {
          // El Admin sigue entrando al Monitor por defecto
          this.router.navigate(['/monitor']);
        } else if (rol === 'GUARDIA') {
          // El Guardia va directo a su herramienta de trabajo: Incidencias
          this.router.navigate(['/incidentes']);
        } else if (rol === 'VISITANTE') {
          this.router.navigate(['/visitante']);
        } else {
          // Si el rol no es ninguno de los esperados, por seguridad cerramos sesión
          this.authService.logout();
          this.errorMessage = 'Rol no autorizado para acceder al sistema.';
        }
      },

      error: (err) => {
        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else {
          this.errorMessage = 'Ha ocurrido un error al iniciar sesión.';
        }
      },
    });
  }

  // Getters para facilitar el acceso desde el HTML
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}