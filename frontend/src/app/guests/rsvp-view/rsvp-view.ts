import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RsvpService, RsvpView } from '../rsvp.service';
import { TicketService, GuestPass } from '../../tickets/ticket.service';
import { buildGoogleCalendarUrl, downloadIcs, buildIcsContent } from '../../invitations/ics.util';
import { Countdown } from '../../invitations/countdown/countdown';
import { MusicPlayer } from '../../invitations/music-player/music-player';
import { InvitationService } from '../../invitations/invitation.service';
import { formatTime12h, formatDateLong } from '../../invitations/time-format';
import { normalizeMapsUrl } from '../../invitations/maps-url';
import { groupFont, groupScale, TypoGroup } from '../../invitations/typography.util';

@Component({
  selector: 'app-rsvp-view',
  standalone: true,
  imports: [ReactiveFormsModule, Countdown, MusicPlayer],
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

  // Tipografía por grupo (nivel 2).
  protected gFont(group: TypoGroup): string {
    return groupFont(this.view()?.invitation.customization, group);
  }
  protected gScale(group: TypoGroup): number {
    return groupScale(this.view()?.invitation.customization, group);
  }

  // Ancho de cada imagen de ejemplo del dress code en %.
  protected dressImgWidth(): string {
    return `${this.view()?.invitation.customization?.dressImagePct ?? 30}%`;
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

  // ¿El invitado tiene modo cerrado (lugares fijos)?
  protected isClosedMode(): boolean {
    return this.view()?.guest.rsvpMode === 'cerrado';
  }

  confirm(): void {
    this.submitError.set(null);
    const v = this.form.getRawValue();
    // En modo cerrado no se elige: el backend usa allowedSeats fijo.
    const seats = this.isClosedMode() ? (this.view()?.guest.allowedSeats ?? 1) : Number(v.seats);
    this.service
      .respond(this.token, {
        status: 'confirmed',
        seats,
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
    return formatDateLong(this.view()?.invitation.data.date);
  }

  // Hora de inicio del evento, para "Recepción: hora".
  protected receptionTime(): string {
    return formatTime12h(this.view()?.invitation.data.time);
  }

  // Hora en formato 12h (evento religioso).
  protected fmtTime(time: string | undefined): string {
    return formatTime12h(time);
  }

  // ¿Hay datos suficientes para ofrecer agregar al calendario? (requiere fecha)
  protected hasCalendar(): boolean {
    const inv = this.view()?.invitation;
    return !!inv && !!buildIcsContent(inv.title, inv.data);
  }

  // Enlace a Google Calendar (web): ideal para Android/escritorio.
  protected googleCalendarUrl(): string | null {
    const inv = this.view()?.invitation;
    if (!inv) return null;
    return buildGoogleCalendarUrl(inv.title, inv.data);
  }

  // Descarga el archivo .ics (Apple Calendar / Outlook).
  protected addToAppleCalendar(): void {
    const inv = this.view()?.invitation;
    if (!inv) return;
    downloadIcs(inv.title, inv.data);
  }
}
