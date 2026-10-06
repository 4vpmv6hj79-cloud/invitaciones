import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicInvitationService, PublicInvitation } from '../public-invitation.service';
import { Countdown } from '../../invitations/countdown/countdown';
import { InvitationService } from '../../invitations/invitation.service';

@Component({
  selector: 'app-invitation-view',
  standalone: true,
  imports: [Countdown],
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

  // Resuelve la URL de la portada (soporta rutas /uploads y URLs externas).
  protected coverSrc(): string {
    return this.invitationService.fileUrl(this.invitation()?.data?.coverImageUrl || '');
  }

  // Resuelve una URL de la galería.
  protected gallerySrc(url: string): string {
    return this.invitationService.fileUrl(url);
  }

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

  // Texto de fecha/hora para mostrar.
  protected when(): string {
    const d = this.invitation()?.data;
    if (!d) return '';
    const time = d.time ? (d.endTime ? `${d.time} – ${d.endTime} h` : `${d.time} h`) : '';
    return [d.date, time].filter(Boolean).join(' · ');
  }
}
