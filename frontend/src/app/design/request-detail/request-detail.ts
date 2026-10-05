import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DesignService, RequestWithThread, DesignReference } from '../design.service';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './request-detail.html',
  styleUrl: './request-detail.scss',
})
export class RequestDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly service = inject(DesignService);

  private id = '';
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly data = signal<RequestWithThread | null>(null);
  protected reply = '';
  protected readonly sending = signal(false);
  protected readonly actionError = signal<string | null>(null);
  protected readonly references = signal<DesignReference[]>([]);
  protected readonly uploadError = signal<string | null>(null);
  protected readonly uploading = signal(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
    this.loadReferences();
  }

  private loadReferences(): void {
    this.service.listReferences(this.id).subscribe({
      next: (refs) => this.references.set(refs),
    });
  }

  fileUrl(url: string): string {
    return this.service.fileUrl(url);
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.uploading.set(true);
    this.uploadError.set(null);
    this.service.uploadReference(this.id, file).subscribe({
      next: () => {
        this.uploading.set(false);
        this.loadReferences();
      },
      error: (e) => {
        this.uploading.set(false);
        this.uploadError.set(e?.error?.message ?? 'No se pudo subir la imagen');
      },
    });
    input.value = '';
  }

  deleteReference(ref: DesignReference): void {
    this.service.deleteReference(this.id, ref.id).subscribe({
      next: () => this.loadReferences(),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.service.getThread(this.id).subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  protected revisionsLeft(): number {
    const r = this.data()?.request;
    return r ? r.revisionLimit - r.revisionsUsed : 0;
  }

  // Envía un comentario o una solicitud de cambios (que consume una revisión).
  send(requestChanges: boolean): void {
    const body = this.reply.trim();
    if (!body) {
      // Antes el clic se ignoraba en silencio y parecía que el botón no hacía nada.
      this.actionError.set('Escribe un mensaje antes de enviar.');
      return;
    }
    this.sending.set(true);
    this.actionError.set(null);
    this.service.addMessage(this.id, body, requestChanges).subscribe({
      next: () => {
        this.reply = '';
        this.sending.set(false);
        this.load();
      },
      error: (e) => {
        this.sending.set(false);
        this.actionError.set(e?.error?.message ?? 'No se pudo enviar el mensaje');
      },
    });
  }

  // Inicia el pago para aprobar la propuesta.
  payAndApprove(): void {
    this.actionError.set(null);
    this.service.payDesign(this.id).subscribe({
      next: (res) => {
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl; // Stripe
        } else {
          window.location.href = `/pago/exito?order=${res.orderId}`; // simulado
        }
      },
      error: (e) => this.actionError.set(e?.error?.message ?? 'No se pudo iniciar el pago'),
    });
  }

  // Solicita un ajuste con costo tras aprobar+pagar.
  requestAdjustment(): void {
    const note = this.reply.trim() || 'Solicito un ajuste adicional.';
    if (!confirm('Los ajustes adicionales tienen un costo extra. El equipo te enviará una nueva propuesta con su precio. ¿Continuar?')) {
      return;
    }
    this.service.requestAdjustment(this.id, note).subscribe({
      next: () => {
        this.reply = '';
        this.load();
      },
      error: (e) => this.actionError.set(e?.error?.message ?? 'No se pudo solicitar el ajuste'),
    });
  }

  money(cents: number): string {
    return this.service.money(cents);
  }
}
