import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DesignService,
  DesignRequest,
  DesignStatus,
  RequestWithThread,
  DesignReference,
} from '../design.service';

@Component({
  selector: 'app-admin-design',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-design.html',
  styleUrl: './admin-design.scss',
})
export class AdminDesign implements OnInit {
  protected readonly service = inject(DesignService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly requests = signal<DesignRequest[]>([]);
  protected readonly filter = signal<DesignStatus | ''>('');
  protected readonly selected = signal<RequestWithThread | null>(null);
  protected proposal = '';
  protected readonly working = signal(false);
  protected readonly refs = signal<DesignReference[]>([]);

  ngOnInit(): void {
    this.reload();
  }

  fileUrl(url: string): string {
    return this.service.fileUrl(url);
  }

  reload(): void {
    this.loading.set(true);
    this.service.adminList(this.filter() || undefined).subscribe({
      next: (list) => {
        this.requests.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar. ¿Tienes rol admin?');
        this.loading.set(false);
      },
    });
  }

  setFilter(s: DesignStatus | ''): void {
    this.filter.set(s);
    this.reload();
  }

  open(r: DesignRequest): void {
    this.service.adminGetThread(r.id).subscribe({
      next: (d) => this.selected.set(d),
    });
    this.service.adminListReferences(r.id).subscribe({
      next: (list) => this.refs.set(list),
    });
  }

  close(): void {
    this.selected.set(null);
    this.proposal = '';
    this.refs.set([]);
  }

  // Precio en pesos (lo convertimos a centavos al enviar).
  protected priceMxn: number | null = null;
  protected readonly proposalError = signal<string | null>(null);

  sendProposal(): void {
    const sel = this.selected();
    const body = this.proposal.trim();
    if (!sel || !body) return;
    if (!this.priceMxn || this.priceMxn < 1) {
      this.proposalError.set('Indica un precio válido (mínimo $1).');
      return;
    }
    this.working.set(true);
    this.proposalError.set(null);
    const priceCents = Math.round(this.priceMxn * 100);
    this.service.adminAddProposal(sel.request.id, body, priceCents).subscribe({
      next: () => {
        this.proposal = '';
        this.priceMxn = null;
        this.working.set(false);
        this.refreshSelected(sel.request.id);
        this.reload();
      },
      error: (e) => {
        this.working.set(false);
        this.proposalError.set(e?.error?.message ?? 'No se pudo enviar la propuesta');
      },
    });
  }

  money(cents: number): string {
    return this.service.money(cents);
  }

  setStatus(status: DesignStatus): void {
    const sel = this.selected();
    if (!sel) return;
    this.service.adminSetStatus(sel.request.id, status).subscribe({
      next: () => {
        this.refreshSelected(sel.request.id);
        this.reload();
      },
    });
  }

  private refreshSelected(id: string): void {
    this.service.adminGetThread(id).subscribe({ next: (d) => this.selected.set(d) });
  }
}
