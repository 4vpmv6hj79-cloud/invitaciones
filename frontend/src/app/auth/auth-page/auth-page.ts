import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, SecurityQuestion } from '../auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  // 'login' o 'register' según la ruta.
  protected readonly mode = signal<'login' | 'register'>(
    this.route.snapshot.data['mode'] === 'register' ? 'register' : 'login',
  );
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  // Catálogo de preguntas de seguridad (para el registro).
  protected readonly securityQuestions = signal<SecurityQuestion[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    securityQuestion: [''],
    securityAnswer: [''],
  });

  ngOnInit(): void {
    if (this.isRegister()) {
      this.auth.getSecurityQuestions().subscribe({
        next: (qs) => this.securityQuestions.set(qs),
        error: () => this.securityQuestions.set([]),
      });
    }
  }

  protected isRegister(): boolean {
    return this.mode() === 'register';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, password, securityQuestion, securityAnswer } = this.form.getRawValue();

    // En registro, la pregunta de seguridad es obligatoria (para recuperar sin correo).
    if (this.isRegister() && (!securityQuestion || !securityAnswer.trim())) {
      this.error.set('Elige una pregunta de seguridad y escribe su respuesta.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const obs = this.isRegister()
      ? this.auth.register(email, password, name, securityQuestion, securityAnswer.trim())
      : this.auth.login(email, password);

    obs.subscribe({
      next: () => {
        const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/mis-invitaciones';
        this.router.navigateByUrl(redirect);
      },
      error: (e) => {
        this.submitting.set(false);
        this.error.set(e?.error?.message ?? 'No se pudo completar la operación');
      },
    });
  }
}
