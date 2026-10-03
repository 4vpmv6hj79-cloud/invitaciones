import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicInvitationService, PublicInvitation } from '../public-invitation.service';

@Component({
  selector: 'app-invitation-view',
  standalone: true,
  imports: [],
  templateUrl: './invitation-view.html',
  styleUrl: './invitation-view.scss',
})
export class InvitationView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(PublicInvitationService);

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

  // Texto de fecha/hora para mostrar.
  protected when(): string {
    const d = this.invitation()?.data;
    if (!d) return '';
    return [d.date, d.time ? `${d.time} h` : ''].filter(Boolean).join(' · ');
  }

  // Enlace para agregar al calendario (archivo .ics generado al vuelo).
  protected calendarHref(): string | null {
    const inv = this.invitation();
    if (!inv?.data?.date) return null;
    const title = inv.title || 'Evento';
    const date = inv.data.date.replace(/-/g, '');
    const time = (inv.data.time || '00:00').replace(':', '') + '00';
    const dt = `${date}T${time}`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DTSTART:${dt}`,
      inv.data.locationName ? `LOCATION:${inv.data.locationName}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ]
      .filter(Boolean)
      .join('\n');
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  }
}
