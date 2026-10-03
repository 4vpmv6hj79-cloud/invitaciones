import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RsvpService, RsvpView } from '../rsvp.service';
import { TicketService, GuestPass } from '../../tickets/ticket.service';

@Component({
  selector: 'app-rsvp-view',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './rsvp-view.html',
  styleUrl: './rsvp-view.scss',
})
export class RsvpViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RsvpService);
  private readonly tickets = inject(TicketService);
  private readonly fb = inject(FormBuilder);

  private token = '';
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly view = signal<RsvpView | null>(null);
  protected readonly done = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly pass = signal<GuestPass | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    seats: [1, [Validators.required, Validators.min(1)]],
    dietaryNotes: [''],
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.service.getView(this.token).subscribe({
      next: (v) => {
        this.view.set(v);
        // Precarga con lo ya confirmado o 1 por defecto.
        this.form.patchValue({
          seats: v.guest.confirmedSeats || 1,
          dietaryNotes: v.guest.dietaryNotes ?? '',
        });
        this.loading.set(false);
        // Si ya estaba confirmado, intenta cargar su pase (si hay boletos).
        if (v.guest.rsvpStatus === 'confirmed') {
          this.loadPass();
        }
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // Carga el pase con QR del invitado (solo tiene efecto si hay boletos activos).
  private loadPass(): void {
    this.tickets.getPass(this.token).subscribe({
      next: (p) => this.pass.set(p),
      error: () => this.pass.set(null),
    });
  }

  // Opciones de lugares, limitadas a los autorizados.
  protected seatOptions(): number[] {
    const max = this.view()?.guest.allowedSeats ?? 1;
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  confirm(): void {
    this.submitError.set(null);
    const v = this.form.getRawValue();
    this.service
      .respond(this.token, {
        status: 'confirmed',
        seats: v.seats,
        dietaryNotes: v.dietaryNotes || undefined,
      })
      .subscribe({
        next: () => {
          this.done.set(true);
          this.loadPass(); // tras confirmar, muestra el pase si hay boletos
        },
        error: (e) =>
          this.submitError.set(e?.error?.message ?? 'No se pudo registrar tu respuesta'),
      });
  }

  decline(): void {
    this.submitError.set(null);
    this.service.respond(this.token, { status: 'declined' }).subscribe({
      next: () => this.done.set(true),
      error: () => this.submitError.set('No se pudo registrar tu respuesta'),
    });
  }

  protected when(): string {
    const d = this.view()?.invitation.data;
    if (!d) return '';
    return [d.date, d.time ? `${d.time} h` : ''].filter(Boolean).join(' · ');
  }
}
