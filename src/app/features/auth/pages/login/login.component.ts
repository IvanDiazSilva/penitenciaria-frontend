import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.services';

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

        // NO guardamos el token aquí manualmente porque el AuthService ya 
        // lo hace en su método login() usando 'auth_token'.

        const userLogueado = this.loginForm.value.username.toLowerCase().trim();
        const rolServidor = res.rol ? res.rol.toUpperCase() : '';

        // Lógica de redirección basada en los paths de tu AppRoutingModule
        if (userLogueado === 'admin' || rolServidor === 'ADMIN') {
          this.router.navigate(['/monitor']); 
        } else if (rolServidor === 'VISITANTE') {
      // Si Iván te devuelve que es VISITANTE, lo mandamos a su listado de visitas
      this.router.navigate(['/visitas']);
        }else if (userLogueado === 'guardia1' || rolServidor === 'GUARDIA') {
          this.router.navigate(['/reos']);
        } else {
          // Por defecto enviamos al monitor si es otro tipo de usuario
          this.router.navigate(['/monitor']);
        }
      },
      error: (err) => {
        this.isLoading = false;
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