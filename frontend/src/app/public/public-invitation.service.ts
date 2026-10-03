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

@Injectable({ providedIn: 'root' })
export class PublicInvitationService {
  private readonly http = inject(HttpClient);

  getByToken(token: string): Observable<PublicInvitation> {
    return this.http.get<PublicInvitation>(`${environment.apiBaseUrl}/p/${token}`);
  }
}
