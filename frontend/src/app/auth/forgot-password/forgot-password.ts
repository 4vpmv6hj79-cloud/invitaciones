import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Pantalla de recuperación de contraseña.
// Mientras el envío automático de correos no esté disponible, dirige al usuario
// a contactar a soporte por correo para recuperar el acceso.
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: '../auth-page/auth-page.scss',
})
export class ForgotPassword {}
