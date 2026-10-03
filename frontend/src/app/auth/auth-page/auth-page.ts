import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
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

  protected readonly form = this.fb.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected isRegister(): boolean {
    return this.mode() === 'register';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, password } = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set(null);

    const obs = this.isRegister()
      ? this.auth.register(email, password, name)
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
