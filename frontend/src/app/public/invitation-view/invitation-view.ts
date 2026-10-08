import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicInvitationService, PublicInvitation } from '../public-invitation.service';
import { Countdown } from '../../invitations/countdown/countdown';
import { MusicPlayer } from '../../invitations/music-player/music-player';
import { InvitationService } from '../../invitations/invitation.service';
import { formatTime12h } from '../../invitations/time-format';
import { normalizeMapsUrl } from '../../invitations/maps-url';

@Component({
  selector: 'app-invitation-view',
  standalone: true,
  imports: [Countdown, MusicPlayer, ReactiveFormsModule],
  templateUrl: './invitation-view.html',
  styleUrl: './invitation-view.scss',
})
export class InvitationView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(PublicInvitationService);
  private readonly invitationService = inject(InvitationService);
  private readonly fb = inject(FormBuilder);

  private token = '';
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly invitation = signal<PublicInvitation | null>(null);

  // Estado del RSVP público.
  protected readonly rsvpDone = signal(false);
  protected readonly rsvpConfirmed = signal(false);
  protected readonly rsvpSending = signal(false);
  protected readonly rsvpError = signal<string | null>(null);

  protected readonly rsvpForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    seats: [1, [Validators.required, Validators.min(1)]],
    dietaryNotes: [''],
  });

  // Modo de confirmación definido por el organizador.
  protected rsvpMode(): 'abierto' | 'cerrado' {
    return this.invitation()?.data?.rsvpMode === 'cerrado' ? 'cerrado' : 'abierto';
  }

  // Acompañantes (adicionales al invitado) en modo cerrado.
  protected rsvpCompanions(): number {
    return Math.max(0, Number(this.invitation()?.data?.rsvpCompanions) || 0);
  }

  // Confirma asistencia desde el enlace compartido.
  confirmRsvp(): void {
    // El nombre siempre es obligatorio; los lugares solo importan en modo abierto.
    if (!this.rsvpForm.controls.name.value.trim()) {
      this.rsvpForm.controls.name.markAsTouched();
      this.rsvpError.set('Escribe tu nombre para confirmar.');
      return;
    }
    this.sendRsvp('confirmed');
  }

  declineRsvp(): void {
    // Para declinar solo se requiere el nombre.
    if (!this.rsvpForm.controls.name.value.trim()) {
      this.rsvpForm.controls.name.markAsTouched();
      this.rsvpError.set('Escribe tu nombre.');
      return;
    }
    this.sendRsvp('declined');
  }

  private sendRsvp(status: 'confirmed' | 'declined'): void {
    const v = this.rsvpForm.getRawValue();
    // En modo cerrado, los lugares = acompañantes + 1 (el invitado).
    // En modo abierto, lo que eligió en el selector.
    const seats =
      this.rsvpMode() === 'cerrado' ? this.rsvpCompanions() + 1 : Number(v.seats);
    this.rsvpSending.set(true);
    this.rsvpError.set(null);
    this.service
      .rsvp(this.token, {
        name: v.name.trim(),
        seats,
        dietaryNotes: v.dietaryNotes || undefined,
        status,
      })
      .subscribe({
        next: () => {
          this.rsvpSending.set(false);
          this.rsvpConfirmed.set(status === 'confirmed');
          this.rsvpDone.set(true);
        },
        error: (e) => {
          this.rsvpSending.set(false);
          this.rsvpError.set(e?.error?.message ?? 'No se pudo registrar tu respuesta.');
        },
      });
  }

  protected seatOptions(): number[] {
    return Array.from({ length: 10 }, (_, i) => i + 1);
  }

  // Resuelve la URL de la portada (soporta rutas /uploads y URLs externas).
  protected coverSrc(): string {
    return this.invitationService.fileUrl(this.invitation()?.data?.coverImageUrl || '');
  }

  // Resuelve una URL de la galería (o del dress code).
  protected gallerySrc(url: string): string {
    return this.invitationService.fileUrl(url);
  }

  // Normaliza el enlace de ubicación para que siempre abra Google Maps.
  protected mapsHref(value: string | undefined): string {
    return normalizeMapsUrl(value);
  }

  // Ancho de la portada en % (fallback desde coverSize para invitaciones viejas).
  protected coverWidth(): string {
    const d = this.invitation()?.data;
    const pct = d?.coverWidthPct ?? this.sizeToPct(d?.coverSize);
    return `${pct}%`;
  }

  // Ancho de cada foto de galería en %.
  protected galleryItemWidth(): string {
    return `${this.invitation()?.data?.galleryItemPct ?? 31}%`;
  }

  private sizeToPct(size: string | undefined): number {
    if (size === 's') return 55;
    if (size === 'l') return 100;
    return 80;
  }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
    this.token = token;
    this.service.getByToken(token).subscribe({
      next: (inv) => {
        this.invitation.set(inv);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // Texto de fecha/hora para mostrar (12h con a.m./p.m.).
  protected when(): string {
    const d = this.invitation()?.data;
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
}
