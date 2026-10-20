import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvitationService } from '../invitation.service';
import { OrderService } from '../../orders/order.service';
import { AuthService } from '../../auth/auth.service';
import { Plan, PlanId } from '../invitation.model';

@Component({
  selector: 'app-plan-selector',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './plan-selector.html',
  styleUrl: './plan-selector.scss',
})
export class PlanSelector implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly invitations = inject(InvitationService);
  private readonly orders = inject(OrderService);
  private readonly auth = inject(AuthService);

  private invitationId = '';
  protected readonly plans = signal<Plan[]>([]);
  protected readonly loading = signal(true);
  protected readonly selected = signal<PlanId>('premium');
  protected readonly publishing = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.invitationId = this.route.snapshot.paramMap.get('id') ?? '';
    this.invitations.getPlans().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los planes.');
        this.loading.set(false);
      },
    });
  }

  protected isAdmin(): boolean {
    return this.auth.user()?.role === 'admin';
  }

  protected select(id: PlanId): void {
    this.selected.set(id);
  }

  // Etiqueta legible para cada clave de función.
  private readonly featureLabels: Record<string, string> = {
    cover: 'Portada personalizada',
    countdown: 'Cuenta regresiva',
    location: 'Ubicación con mapa',
    dressCode: 'Código de vestimenta',
    gift: 'Mesa de regalos',
    gallery: 'Galería de fotos',
    rsvp: 'Confirmación de asistencia',
    music: 'Música de fondo',
    guestPasses: 'Pases y cupos por invitado',
    religious: 'Evento religioso',
    parents: 'Padres y padrinos',
    lodging: 'Hospedaje',
    recommendations: 'Recomendaciones',
    weather: 'Clima',
    sectionImages: 'Imágenes entre secciones',
    ticketsQr: 'Boletos QR y control de acceso',
  };

  protected featureLabel(key: string): string {
    return this.featureLabels[key] ?? key;
  }

  // Precio formateado en pesos (desde centavos).
  protected price(cents: number): string {
    return (cents / 100).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    });
  }

  // Confirma el plan elegido: admin publica sin pago, el resto va al checkout.
  confirm(): void {
    if (this.publishing()) return;
    this.publishing.set(true);
    this.error.set(null);

    // Administrador: publica directo con el plan elegido, sin pago.
    if (this.isAdmin()) {
      this.invitations.publishAsAdmin(this.invitationId).subscribe({
        next: () => {
          window.location.href = `/pago/exito?invitation=${this.invitationId}`;
        },
        error: () => {
          this.publishing.set(false);
          this.error.set('No se pudo publicar. Intenta de nuevo.');
        },
      });
      return;
    }

    this.orders.createCheckout(this.invitationId, this.selected()).subscribe({
      next: (res) => {
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          window.location.href = `/pago/exito?order=${res.orderId}`;
        }
      },
      error: () => {
        this.publishing.set(false);
        this.error.set('No se pudo iniciar el pago. Intenta de nuevo.');
      },
    });
  }
}
