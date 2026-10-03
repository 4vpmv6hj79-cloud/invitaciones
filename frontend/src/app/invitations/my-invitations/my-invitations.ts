import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InvitationService } from '../invitation.service';
import { Invitation } from '../invitation.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-my-invitations',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-invitations.html',
  styleUrl: './my-invitations.scss',
})
export class MyInvitations implements OnInit {
  private readonly service = inject(InvitationService);
  protected readonly auth = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly invitations = signal<Invitation[]>([]);

  ngOnInit(): void {
    this.service.listMine().subscribe({
      next: (list) => {
        this.invitations.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected title(inv: Invitation): string {
    return inv.event?.title || 'Invitación sin título';
  }

  protected readonly downloading = signal<string | null>(null);
  // Tamaño de PDF seleccionado por invitación (default A5).
  protected readonly pdfSize = signal<Record<string, string>>({});

  setPdfSize(id: string, size: string): void {
    this.pdfSize.update((m) => ({ ...m, [id]: size }));
  }

  downloadPdf(inv: Invitation): void {
    this.downloading.set(inv.id);
    const size = this.pdfSize()[inv.id] ?? 'A5';
    const filename = `${this.title(inv).replace(/\s+/g, '-').toLowerCase()}-${size}.pdf`;
    this.service.downloadPdf(inv.id, filename, size).subscribe({
      next: () => this.downloading.set(null),
      error: () => this.downloading.set(null),
    });
  }
}
