import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicInvitationService, PublicInvitation } from '../public-invitation.service';
import { Countdown } from '../../invitations/countdown/countdown';
import { MusicPlayer } from '../../invitations/music-player/music-player';
import { InvitationService } from '../../invitations/invitation.service';
import { formatTime12h, formatDateLong } from '../../invitations/time-format';
import { normalizeMapsUrl } from '../../invitations/maps-url';
import { groupFont, groupScale, TypoGroup } from '../../invitations/typography.util';

// Vista pública de la invitación (enlace compartido /i/:token).
// Solo muestra la invitación; la confirmación de asistencia se hace por el
// enlace personal de cada invitado (/r/:token), que respeta su cupo.
@Component({
  selector: 'app-invitation-view',
  standalone: true,
  imports: [Countdown, MusicPlayer],
  templateUrl: './invitation-view.html',
  styleUrl: './invitation-view.scss',
})
export class InvitationView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(PublicInvitationService);
  private readonly invitationService = inject(InvitationService);

  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly invitation = signal<PublicInvitation | null>(null);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
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

  // Tipografía por grupo (nivel 2).
  protected gFont(group: TypoGroup): string {
    return groupFont(this.invitation()?.customization, group);
  }
  protected gScale(group: TypoGroup): number {
    return groupScale(this.invitation()?.customization, group);
  }

  // Ancho de cada imagen de ejemplo del dress code en %.
  protected dressImgWidth(): string {
    return `${this.invitation()?.customization?.dressImagePct ?? 30}%`;
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

  // Solo la fecha (larga en español). La hora se muestra aparte, como "Recepción".
  protected when(): string {
    return formatDateLong(this.invitation()?.data?.date);
  }

  // Hora de inicio del evento, para mostrar como "Recepción".
  protected receptionTime(): string {
    return formatTime12h(this.invitation()?.data?.time);
  }

  // Hora en formato 12h (evento religioso).
  protected fmtTime(time: string | undefined): string {
    return formatTime12h(time);
  }
}
