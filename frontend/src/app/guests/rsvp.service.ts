import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EventData, InvitationCustomization } from '../invitations/invitation.model';

export interface RsvpView {
  guest: {
    name: string;
    allowedSeats: number;
    rsvpStatus: 'pending' | 'confirmed' | 'declined';
    confirmedSeats: number;
    dietaryNotes: string | null;
  };
  invitation: {
    title: string;
    eventType: string;
    data: EventData;
    customization: InvitationCustomization;
    status: string;
  };
}

export interface RsvpResponse {
  status: 'confirmed' | 'declined';
  seats?: number;
  dietaryNotes?: string;
}

@Injectable({ providedIn: 'root' })
export class RsvpService {
  private readonly http = inject(HttpClient);
  private base(token: string): string {
    return `${environment.apiBaseUrl}/rsvp/${token}`;
  }

  getView(token: string): Observable<RsvpView> {
    return this.http.get<RsvpView>(this.base(token));
  }

  respond(token: string, payload: RsvpResponse): Observable<{ rsvpStatus: string; confirmedSeats: number }> {
    return this.http.post<{ rsvpStatus: string; confirmedSeats: number }>(
      this.base(token),
      payload,
    );
  }
}
