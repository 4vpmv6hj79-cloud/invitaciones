import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type DesignStatus =
  | 'nueva'
  | 'en_proceso'
  | 'propuesta'
  | 'aprobada'
  | 'rechazada'
  | 'ajuste_solicitado';

export interface DesignRequest {
  id: string;
  requesterId: string;
  title: string;
  eventType: string;
  style: string;
  details: string;
  budget: string | null;
  status: DesignStatus;
  priceCents: number | null;
  paid: boolean;
  revisionsUsed: number;
  revisionLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface DesignCheckout {
  orderId: string;
  checkoutUrl: string | null;
  simulated: boolean;
}

export interface DesignMessage {
  id: string;
  requestId: string;
  authorId: string;
  authorRole: 'client' | 'admin';
  body: string;
  isProposal: boolean;
  createdAt: string;
}

export interface RequestWithThread {
  request: DesignRequest;
  messages: DesignMessage[];
}

export interface CreateRequestPayload {
  title: string;
  eventType: string;
  style?: string;
  details: string;
  budget?: string;
}

export interface DesignReference {
  id: string;
  requestId: string;
  url: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class DesignService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl;

  // --- Cliente ---
  create(payload: CreateRequestPayload): Observable<DesignRequest> {
    return this.http.post<DesignRequest>(`${this.api}/design-requests`, payload);
  }
  listMine(): Observable<DesignRequest[]> {
    return this.http.get<DesignRequest[]>(`${this.api}/design-requests`);
  }
  getThread(id: string): Observable<RequestWithThread> {
    return this.http.get<RequestWithThread>(`${this.api}/design-requests/${id}`);
  }
  addMessage(id: string, body: string, requestChanges = false): Observable<DesignMessage> {
    return this.http.post<DesignMessage>(`${this.api}/design-requests/${id}/messages`, {
      body,
      requestChanges,
    });
  }
  // Inicia el pago de la propuesta (para aprobar). Devuelve URL de Stripe o modo simulado.
  payDesign(id: string): Observable<DesignCheckout> {
    return this.http.post<DesignCheckout>(`${this.api}/orders/design`, {
      designRequestId: id,
    });
  }

  // Solicita un ajuste tras aprobar+pagar (tendrá costo adicional).
  requestAdjustment(id: string, note: string): Observable<unknown> {
    return this.http.post(`${this.api}/design-requests/${id}/request-adjustment`, { note });
  }

  // Formatea centavos a MXN.
  money(cents: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
      cents / 100,
    );
  }

  // --- Admin ---
  adminList(status?: DesignStatus): Observable<DesignRequest[]> {
    const q = status ? `?status=${status}` : '';
    return this.http.get<DesignRequest[]>(`${this.api}/admin/design-requests${q}`);
  }
  adminGetThread(id: string): Observable<RequestWithThread> {
    return this.http.get<RequestWithThread>(`${this.api}/admin/design-requests/${id}`);
  }
  adminSetStatus(id: string, status: DesignStatus): Observable<DesignRequest> {
    return this.http.patch<DesignRequest>(`${this.api}/admin/design-requests/${id}/status`, {
      status,
    });
  }
  adminAddProposal(id: string, body: string, priceCents: number): Observable<DesignMessage> {
    return this.http.post<DesignMessage>(`${this.api}/admin/design-requests/${id}/proposal`, {
      body,
      priceCents,
    });
  }

  // --- Imágenes de referencia ---
  listReferences(id: string): Observable<DesignReference[]> {
    return this.http.get<DesignReference[]>(`${this.api}/design-requests/${id}/references`);
  }
  uploadReference(id: string, file: File): Observable<DesignReference> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<DesignReference>(
      `${this.api}/design-requests/${id}/references`,
      form,
    );
  }
  deleteReference(id: string, refId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/design-requests/${id}/references/${refId}`);
  }
  adminListReferences(id: string): Observable<DesignReference[]> {
    return this.http.get<DesignReference[]>(
      `${this.api}/admin/design-requests/${id}/references`,
    );
  }
  // URL absoluta de una imagen servida por el backend.
  fileUrl(url: string): string {
    return `${this.api}${url}`;
  }

  statusLabel(s: DesignStatus): string {
    const map: Record<DesignStatus, string> = {
      nueva: 'Nueva',
      en_proceso: 'En proceso',
      propuesta: 'Propuesta enviada',
      aprobada: 'Aprobada y pagada',
      rechazada: 'Rechazada',
      ajuste_solicitado: 'Ajuste solicitado',
    };
    return map[s] ?? s;
  }
}
