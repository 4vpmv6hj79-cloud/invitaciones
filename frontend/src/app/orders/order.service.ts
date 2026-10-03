import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CheckoutResult {
  orderId: string;
  checkoutUrl: string | null; // URL de Stripe; null en modo simulado
  simulated: boolean;
}

export interface OrderStatus {
  id: string;
  status: 'pending' | 'paid' | 'refunded' | 'canceled';
  invitationId: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/orders`;

  // Inicia el pago de la publicación de una invitación.
  createCheckout(invitationId: string): Observable<CheckoutResult> {
    return this.http.post<CheckoutResult>(this.baseUrl, { invitationId });
  }

  getStatus(orderId: string): Observable<OrderStatus> {
    return this.http.get<OrderStatus>(`${this.baseUrl}/${orderId}`);
  }
}
