import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'canceled';

export interface AdminOrder {
  id: string;
  invitationId: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  provider: string;
  paymentRef: string | null;
  createdAt: string;
}

export interface SalesReport {
  totalOrders: number;
  byStatus: Record<string, number>;
  paidOrders: number;
  grossRevenueCents: number;
  estimatedFeesCents: number;
  estimatedNetCents: number;
  currency: string;
  note: string;
}

@Injectable({ providedIn: 'root' })
export class AdminOrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/admin`;

  listOrders(status?: OrderStatus): Observable<AdminOrder[]> {
    const q = status ? `?status=${status}` : '';
    return this.http.get<AdminOrder[]>(`${this.baseUrl}/orders${q}`);
  }

  refund(orderId: string): Observable<AdminOrder> {
    return this.http.post<AdminOrder>(`${this.baseUrl}/orders/${orderId}/refund`, {});
  }

  salesReport(): Observable<SalesReport> {
    return this.http.get<SalesReport>(`${this.baseUrl}/reports/sales`);
  }
}
