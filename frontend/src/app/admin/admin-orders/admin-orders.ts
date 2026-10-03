import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  AdminOrder,
  AdminOrdersService,
  OrderStatus,
  SalesReport,
} from '../admin-orders.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.scss',
})
export class AdminOrders implements OnInit {
  private readonly service = inject(AdminOrdersService);

  protected readonly loading = signal(true);
  protected readonly orders = signal<AdminOrder[]>([]);
  protected readonly report = signal<SalesReport | null>(null);
  protected readonly filter = signal<OrderStatus | ''>('');
  protected readonly refunding = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.reloadReport();
    this.reloadOrders();
  }

  private reloadOrders(): void {
    this.loading.set(true);
    const status = this.filter() || undefined;
    this.service.listOrders(status as OrderStatus | undefined).subscribe({
      next: (list) => {
        this.orders.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los pedidos. ¿Tienes rol admin?');
        this.loading.set(false);
      },
    });
  }

  private reloadReport(): void {
    this.service.salesReport().subscribe({ next: (r) => this.report.set(r) });
  }

  setFilter(status: OrderStatus | ''): void {
    this.filter.set(status);
    this.reloadOrders();
  }

  refund(o: AdminOrder): void {
    if (!confirm(`¿Reembolsar el pedido por ${this.money(o.amount)}? Esta acción es difícil de revertir.`)) {
      return;
    }
    this.refunding.set(o.id);
    this.service.refund(o.id).subscribe({
      next: () => {
        this.refunding.set(null);
        this.reloadOrders();
        this.reloadReport();
      },
      error: () => {
        this.refunding.set(null);
        this.error.set('No se pudo reembolsar el pedido.');
      },
    });
  }

  // Convierte centavos a texto de dinero en MXN.
  money(cents: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
      cents / 100,
    );
  }

  statusLabel(s: string): string {
    const map: Record<string, string> = {
      paid: 'Pagado',
      pending: 'Pendiente',
      refunded: 'Reembolsado',
      canceled: 'Cancelado',
    };
    return map[s] ?? s;
  }
}
