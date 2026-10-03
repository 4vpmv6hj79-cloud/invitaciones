import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GuestService, Guest, GuestSummary } from '../guest.service';
import { TicketService } from '../../tickets/ticket.service';
import { InvitationService } from '../../invitations/invitation.service';

@Component({
  selector: 'app-guests-panel',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './guests-panel.html',
  styleUrl: './guests-panel.scss',
})
export class GuestsPanel implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(GuestService);
  private readonly tickets = inject(TicketService);
  private readonly invitations = inject(InvitationService);
  private readonly fb = inject(FormBuilder);

  protected invitationId = '';
  protected readonly loading = signal(true);
  protected readonly guests = signal<Guest[]>([]);
  protected readonly summary = signal<GuestSummary | null>(null);
  protected readonly copiedToken = signal<string | null>(null);
  protected readonly importResult = signal<string | null>(null);

  // Boletos
  protected readonly ticketsEnabled = signal(false);
  protected readonly ticketMsg = signal<string | null>(null);
  protected staffEmail = '';
  protected readonly staffMsg = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    contact: [''],
    allowedSeats: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.invitationId = this.route.snapshot.paramMap.get('invitationId') ?? '';
    this.reload();
    // Carga el estado actual del módulo de boletos.
    this.invitations.getById(this.invitationId).subscribe({
      next: (inv) => this.ticketsEnabled.set(inv.ticketsEnabled),
    });
  }

  private reload(): void {
    this.loading.set(true);
    this.service.list(this.invitationId).subscribe({
      next: (list) => {
        this.guests.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.service.summary(this.invitationId).subscribe({
      next: (s) => this.summary.set(s),
    });
  }

  addGuest(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.service
      .create(this.invitationId, {
        name: v.name,
        contact: v.contact || undefined,
        allowedSeats: v.allowedSeats,
      })
      .subscribe({
        next: () => {
          this.form.reset({ name: '', contact: '', allowedSeats: 1 });
          this.reload();
        },
      });
  }

  removeGuest(g: Guest): void {
    this.service.remove(this.invitationId, g.id).subscribe({ next: () => this.reload() });
  }

  copyLink(g: Guest): void {
    const link = this.service.guestLink(g.accessToken);
    navigator.clipboard?.writeText(link).then(() => {
      this.copiedToken.set(g.accessToken);
      setTimeout(() => this.copiedToken.set(null), 2000);
    });
  }

  download(): void {
    window.open(this.service.exportUrl(this.invitationId), '_blank');
  }

  onImportFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const csv = String(reader.result ?? '');
      this.service.importCsv(this.invitationId, csv).subscribe({
        next: (res) => {
          this.importResult.set(`${res.imported} invitado(s) importado(s)`);
          this.reload();
          setTimeout(() => this.importResult.set(null), 3000);
        },
      });
    };
    reader.readAsText(file);
    input.value = '';
  }

  statusLabel(s: string): string {
    return s === 'confirmed' ? 'Confirmado' : s === 'declined' ? 'No asistirá' : 'Pendiente';
  }

  // --- Boletos ---

  toggleTickets(): void {
    const next = !this.ticketsEnabled();
    this.tickets.setTicketsEnabled(this.invitationId, next).subscribe({
      next: (r) => {
        this.ticketsEnabled.set(r.ticketsEnabled);
        this.ticketMsg.set(
          r.ticketsEnabled
            ? `Boletos activados. Pases emitidos: ${r.issued}.`
            : 'Boletos desactivados.',
        );
        setTimeout(() => this.ticketMsg.set(null), 3000);
      },
      error: () => this.ticketMsg.set('No se pudo cambiar el estado de boletos.'),
    });
  }

  assignStaff(): void {
    const email = this.staffEmail.trim();
    if (!email) return;
    this.tickets.assignStaff(this.invitationId, email).subscribe({
      next: () => {
        this.staffMsg.set(`${email} ahora puede validar accesos.`);
        this.staffEmail = '';
        setTimeout(() => this.staffMsg.set(null), 3000);
      },
      error: (e) =>
        this.staffMsg.set(e?.error?.message ?? 'No se pudo asignar al personal.'),
    });
  }
}
