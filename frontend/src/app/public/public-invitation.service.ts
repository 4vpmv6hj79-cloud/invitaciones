import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EventData, InvitationCustomization } from '../invitations/invitation.model';

// Datos públicos que devuelve el backend (sin ids internos ni pedidos).
export interface PublicInvitation {
  title: string;
  eventType: string;
  data: EventData;
  customization: InvitationCustomization;
  expired: boolean;
}

export interface PublicRsvpPayload {
  name: string;
  seats?: number;
  dietaryNotes?: string;
  status?: 'confirmed' | 'declined';
}

@Injectable({ providedIn: 'root' })
export class PublicInvitationService {
  private readonly http = inject(HttpClient);

  getByToken(token: string): Observable<PublicInvitation> {
    return this.http.get<PublicInvitation>(`${environment.apiBaseUrl}/p/${token}`);
  }

  // Confirma asistencia desde el enlace compartido (el invitado se auto-registra).
  rsvp(token: string, payload: PublicRsvpPayload): Observable<{ ok: boolean; status: string }> {
    return this.http.post<{ ok: boolean; status: string }>(
      `${environment.apiBaseUrl}/rsvp/public/${token}`,
      payload,
    );
  }
}
