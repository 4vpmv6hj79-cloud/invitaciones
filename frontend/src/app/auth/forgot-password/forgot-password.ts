import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, SecurityQuestion } from '../auth.service';

// Recuperación de contraseña SIN correo, en la misma página:
//  1) El usuario escribe su correo.
//  2) Mostramos su pregunta de seguridad; responde.
//  3) Si la respuesta es correcta, define una nueva contraseña.
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: '../auth-page/auth-page.scss',
})
export class ForgotPassword {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Paso actual del flujo.
  protected readonly step = signal<1 | 2 | 3 | 'done'>(1);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  // Datos capturados.
  protected email = '';
  protected answer = '';
  protected password = '';
  protected confirm = '';

  // Texto de la pregunta de seguridad del usuario.
  protected readonly questionText = signal<string>('');
  private questions: SecurityQuestion[] = [];

  constructor() {
    // Precarga el catálogo para traducir el id de pregunta a su texto.
    this.auth.getSecurityQuestions().subscribe({
      next: (qs) => (this.questions = qs),
      error: () => (this.questions = []),
    });
  }

  // Paso 1 → 2: busca la pregunta de seguridad del correo.
  lookup(): void {
    const email = this.email.trim().toLowerCase();
    if (!email) {
      this.error.set('Escribe tu correo.');
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.getSecurityQuestionFor(email).subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (!res.questionId) {
          this.error.set(
            'No encontramos una pregunta de seguridad para ese correo. ' +
              'Verifica el correo o contacta a soporte.',
          );
          return;
        }
        const q = this.questions.find((x) => x.id === res.questionId);
        this.questionText.set(q?.text ?? 'Tu pregunta de seguridad');
        this.step.set(2);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('No se pudo continuar. Intenta de nuevo.');
      },
    });
  }

  // Paso 2 → 3: pasa a definir la nueva contraseña (la respuesta se valida al final).
  goToNewPassword(): void {
    if (!this.answer.trim()) {
      this.error.set('Escribe la respuesta a tu pregunta de seguridad.');
      return;
    }
    this.error.set(null);
    this.step.set(3);
  }

  // Paso 3: restablece la contraseña verificando la respuesta en el backend.
  reset(): void {
    if (this.password.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (this.password !== this.confirm) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.securityReset(this.email.trim().toLowerCase(), this.answer.trim(), this.password).subscribe({
      next: () => {
        this.submitting.set(false);
        this.step.set('done');
      },
      error: (e: { error?: { message?: string } }) => {
        this.submitting.set(false);
        this.error.set(e?.error?.message ?? 'No se pudo restablecer la contraseña.');
      },
    });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
