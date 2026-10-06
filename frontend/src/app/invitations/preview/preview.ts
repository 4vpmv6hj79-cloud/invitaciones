import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvitationService } from '../invitation.service';
import { Invitation } from '../invitation.model';
import { Countdown } from '../countdown/countdown';

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

  protected when(): string {
    const d = this.invitation()?.event?.data;
    if (!d) return '';
    const time = d.time ? (d.endTime ? `${d.time} – ${d.endTime} h` : `${d.time} h`) : '';
    return [d.date, time].filter(Boolean).join(' · ');
  }
}
