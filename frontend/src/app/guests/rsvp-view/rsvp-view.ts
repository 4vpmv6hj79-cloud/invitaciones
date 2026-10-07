import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RsvpService, RsvpView } from '../rsvp.service';
import { TicketService, GuestPass } from '../../tickets/ticket.service';
import { buildCalendarHref } from '../../invitations/ics.util';
import { Countdown } from '../../invitations/countdown/countdown';
import { InvitationService } from '../../invitations/invitation.service';
import { formatTime12h } from '../../invitations/time-format';
import { normalizeMapsUrl } from '../../invitations/maps-url';

@Component({
  selector: 'app-rsvp-view',
  standalone: true,
  imports: [ReactiveFormsModule, Countdown],
  templateUrl: './rsvp-view.html',
  styleUrl: './rsvp-view.scss',
})
export class RsvpViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RsvpService);
  private readonly tickets = inject(TicketService);
  private readonly invitationService = inject(InvitationService);
  private readonly fb = inject(FormBuilder);

  // Resuelve la URL de la portada (soporta rutas /uploads y URLs externas).
  protected coverSrc(): string {
    return this.invitationService.fileUrl(this.view()?.invitation.data.coverImageUrl || '');
  }

  // Resuelve una URL de la galería.
  protected gallerySrc(url: string): string {
    return this.invitationService.fileUrl(url);
  }

  // Normaliza el enlace de ubicación para que siempre abra Google Maps.
  protected mapsHref(value: string | undefined): string {
    return normalizeMapsUrl(value);
  }

  // Ancho de la portada en % (fallback desde coverSize para invitaciones viejas).
  protected coverWidth(): string {
    const d = this.view()?.invitation.data;
    const pct = d?.coverWidthPct ?? this.sizeToPct(d?.coverSize);
    return `${pct}%`;
  }

  protected galleryItemWidth(): string {
    return `${this.view()?.invitation.data.galleryItemPct ?? 31}%`;
  }

  private sizeToPct(size: string | undefined): number {
    if (size === 's') return 55;
    if (size === 'l') return 100;
    return 80;
  }

  private token = '';
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly view = signal<RsvpView | null>(null);
  protected readonly done = signal(false);
  // true solo cuando la respuesta fue "confirmado" (no cuando declina).
  protected readonly confirmed = signal(false);
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
        // Si ya estaba confirmado, marca el estado, muestra el resultado y carga su pase.
        if (v.guest.rsvpStatus === 'confirmed') {
          this.done.set(true);
          this.confirmed.set(true);
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
          this.confirmed.set(true);
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
    let time = '';
    if (d.time) {
      const start = formatTime12h(d.time);
      time = d.endTime ? `${start} – ${formatTime12h(d.endTime)}` : start;
    }
    return [d.date, time].filter(Boolean).join(' · ');
  }

  // Hora en formato 12h (evento religioso).
  protected fmtTime(time: string | undefined): string {
    return formatTime12h(time);
  }

  // Enlace .ics (evento principal + misa) para agregar al calendario.
  // Se usa solo tras confirmar asistencia.
  protected calendarHref(): string | null {
    const inv = this.view()?.invitation;
    if (!inv) return null;
    return buildCalendarHref(inv.title, inv.data);
  }
}
