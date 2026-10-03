import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GuestPass {
  hasPass: boolean;
  guestName?: string;
  seats?: number;
  qrDataUrl?: string;
  reason?: string;
}

export interface ValidationResult {
  state: 'valid' | 'already_used' | 'not_confirmed';
  guestName: string;
  confirmedSeats: number;
  checkedInAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl;

  // Pase del invitado (público, por su accessToken de RSVP).
  getPass(accessToken: string): Observable<GuestPass> {
    return this.http.get<GuestPass>(`${this.api}/pass/${accessToken}`);
  }

  // --- Personal de acceso / dueño (requiere sesión) ---

  inspect(ticketToken: string): Observable<ValidationResult> {
    return this.http.get<ValidationResult>(`${this.api}/tickets/${ticketToken}`);
  }

  checkIn(ticketToken: string): Observable<ValidationResult> {
    return this.http.post<ValidationResult>(`${this.api}/tickets/${ticketToken}/checkin`, {});
  }

  // --- Organizador (dueño) ---

  setTicketsEnabled(invitationId: string, enabled: boolean): Observable<{ ticketsEnabled: boolean; issued: number }> {
    return this.http.patch<{ ticketsEnabled: boolean; issued: number }>(
      `${this.api}/invitations/${invitationId}/tickets`,
      { enabled },
    );
  }

  assignStaff(invitationId: string, email: string): Observable<unknown> {
    return this.http.post(`${this.api}/invitations/${invitationId}/staff`, { email });
  }
}
