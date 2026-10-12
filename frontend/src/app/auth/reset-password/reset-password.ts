import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: '../auth-page/auth-page.scss',
})
export class ResetPassword implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private token = '';
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly done = signal(false);
  // true si falta el token en la URL (enlace inválido).
  protected readonly missingToken = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.missingToken.set(true);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { password, confirm } = this.form.getRawValue();
    if (password !== confirm) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.resetPassword(this.token, password).subscribe({
      next: () => {
        this.submitting.set(false);
        this.done.set(true);
      },
      error: (e) => {
        this.submitting.set(false);
        this.error.set(e?.error?.message ?? 'No se pudo restablecer la contraseña.');
      },
    });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
