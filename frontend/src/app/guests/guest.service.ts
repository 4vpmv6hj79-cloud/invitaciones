import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type RsvpStatus = 'pending' | 'confirmed' | 'declined';

export type GuestRsvpMode = 'abierto' | 'cerrado';

export interface Guest {
  id: string;
  invitationId: string;
  groupId?: string | null;
  name: string;
  contact?: string | null;
  allowedSeats: number;
  rsvpMode: GuestRsvpMode;
  rsvpStatus: RsvpStatus;
  confirmedSeats: number;
  dietaryNotes?: string | null;
  accessToken: string;
}

export interface GuestSummary {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  seatsConfirmed: number;
  seatsAllowed: number;
}

export interface CreateGuestPayload {
  name: string;
  contact?: string;
  allowedSeats: number;
  rsvpMode?: GuestRsvpMode;
  groupId?: string;
}

@Injectable({ providedIn: 'root' })
export class GuestService {
  private readonly http = inject(HttpClient);
  private base(invitationId: string): string {
    return `${environment.apiBaseUrl}/invitations/${invitationId}/guests`;
  }

  list(invitationId: string): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.base(invitationId));
  }

  summary(invitationId: string): Observable<GuestSummary> {
    return this.http.get<GuestSummary>(`${this.base(invitationId)}/summary`);
  }

  create(invitationId: string, payload: CreateGuestPayload): Observable<Guest> {
    return this.http.post<Guest>(this.base(invitationId), payload);
  }

  remove(invitationId: string, guestId: string): Observable<void> {
    return this.http.delete<void>(`${this.base(invitationId)}/${guestId}`);
  }

  importCsv(invitationId: string, csv: string): Observable<{ imported: number }> {
    return this.http.post<{ imported: number }>(`${this.base(invitationId)}/import`, { csv });
  }

  // URL del endpoint de exportación (se abre directamente para descargar).
  exportUrl(invitationId: string): string {
    return `${this.base(invitationId)}/export`;
  }

  // Enlace privado del invitado (para que el organizador lo comparta).
  guestLink(token: string): string {
    return `${location.origin}/r/${token}`;
  }
}
