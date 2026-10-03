import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../order.service';
import { InvitationService } from '../../invitations/invitation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.scss',
})
export class PaymentSuccess implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orders = inject(OrderService);
  private readonly invitations = inject(InvitationService);

  protected readonly state = signal<'checking' | 'ready' | 'pending' | 'error'>('checking');
  protected readonly publicUrl = signal('');
  protected readonly shareUrl = signal('');
  protected readonly imageUrl = signal('');
  protected readonly invitationId = signal('');
  protected readonly copied = signal(false);

  // Reintentos: el webhook de Stripe puede tardar un instante en confirmar.
  private attempts = 0;

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParamMap.get('order');
    if (!orderId) {
      this.state.set('error');
      return;
    }
    this.poll(orderId);
  }

  private poll(orderId: string): void {
    this.orders.getStatus(orderId).subscribe({
      next: (order) => {
        if (order.status === 'paid') {
          this.loadLinks(order.invitationId);
        } else if (this.attempts < 10) {
          // Aún pendiente: reintenta mientras llega la confirmación del webhook.
          this.attempts += 1;
          this.state.set('pending');
          setTimeout(() => this.poll(orderId), 1500);
        } else {
          this.state.set('pending');
        }
      },
      error: () => this.state.set('error'),
    });
  }

  private loadLinks(invitationId: string): void {
    this.invitations.getById(invitationId).subscribe({
      next: (inv) => {
        const token = inv.publicToken;
        if (!token) {
          this.state.set('pending');
          return;
        }
        this.publicUrl.set(`${location.origin}/i/${token}`);
        this.shareUrl.set(`${environment.apiBaseUrl}/p/${token}/share`);
        this.imageUrl.set(`${environment.apiBaseUrl}/p/${token}/image.svg`);
        this.invitationId.set(invitationId);
        this.state.set('ready');
      },
      error: () => this.state.set('error'),
    });
  }

  copyLink(): void {
    navigator.clipboard?.writeText(this.publicUrl()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  // Enlace a WhatsApp con el enlace de compartir (que lleva la vista previa Open Graph).
  whatsappUrl(): string {
    const text = encodeURIComponent(`Te invitamos: ${this.shareUrl()}`);
    return `https://wa.me/?text=${text}`;
  }
}
