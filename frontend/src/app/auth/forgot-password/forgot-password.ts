import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: '../auth-page/auth-page.scss',
})
export class ForgotPassword {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  // Mensaje de confirmación tras enviar (siempre genérico, no revela si el correo existe).
  protected readonly sentMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.forgotPassword(this.form.getRawValue().email).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.sentMessage.set(res.message);
      },
      error: () => {
        this.submitting.set(false);
        // Aun ante error del servidor, mostramos el mensaje genérico de seguridad.
        this.sentMessage.set(
          'Si el correo está registrado, enviaremos un enlace para restablecer la contraseña.',
        );
      },
    });
  }
}
