import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DesignService } from '../design.service';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './request-form.html',
  styleUrl: './request-form.scss',
})
export class RequestForm {
  private readonly service = inject(DesignService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    eventType: ['', [Validators.required]],
    style: [''],
    details: ['', [Validators.required, Validators.minLength(5)]],
    budget: [''],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set(null);
    this.service
      .create({
        title: v.title,
        eventType: v.eventType,
        style: v.style || undefined,
        details: v.details,
        budget: v.budget || undefined,
      })
      .subscribe({
        next: (r) => this.router.navigate(['/solicitudes', r.id]),
        error: (e) => {
          this.submitting.set(false);
          this.error.set(e?.error?.message ?? 'No se pudo enviar la solicitud');
        },
      });
  }
}
