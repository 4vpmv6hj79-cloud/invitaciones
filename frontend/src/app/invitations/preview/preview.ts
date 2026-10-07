import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvitationService } from '../invitation.service';
import { Invitation } from '../invitation.model';
import { Countdown } from '../countdown/countdown';
import { formatTime12h } from '../time-format';
import { normalizeMapsUrl } from '../maps-url';

// Vista previa de la invitación tal como la verán los invitados,
// usando el borrador (por id) y SIN necesidad de publicar/pagar.
@Component({
  selector: 'app-invitation-preview',
  standalone: true,
  imports: [RouterLink, Countdown],
  templateUrl: './preview.html',
  styleUrl: './preview.scss',
})
export class InvitationPreview implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(InvitationService);

  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly invitation = signal<Invitation | null>(null);

  private id = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
    this.service.getById(this.id).subscribe({
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

  protected backToEditor(): string {
    return `/editor/${this.id}`;
  }

  // Resuelve la URL de la portada (soporta rutas /uploads y URLs externas).
  protected coverSrc(): string {
    return this.service.fileUrl(this.invitation()?.event?.data?.coverImageUrl || '');
  }

  // Resuelve una URL de la galería.
  protected gallerySrc(url: string): string {
    return this.service.fileUrl(url);
  }

  // Normaliza el enlace de ubicación para que siempre abra Google Maps.
  protected mapsHref(value: string | undefined): string {
    return normalizeMapsUrl(value);
  }

  // Ancho de la portada en % (fallback desde coverSize).
  protected coverWidth(): string {
    const d = this.invitation()?.event?.data;
    const pct = d?.coverWidthPct ?? this.sizeToPct(d?.coverSize);
    return `${pct}%`;
  }

  protected galleryItemWidth(): string {
    return `${this.invitation()?.event?.data?.galleryItemPct ?? 31}%`;
  }

  private sizeToPct(size: string | undefined): number {
    if (size === 's') return 55;
    if (size === 'l') return 100;
    return 80;
  }

  protected when(): string {
    const d = this.invitation()?.event?.data;
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
