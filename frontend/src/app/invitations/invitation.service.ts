import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';
import {
  CreateInvitationPayload,
  Invitation,
  UpdateInvitationPayload,
} from './invitation.model';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/invitations`;

  // Crea un borrador a partir de una plantilla.
  createDraft(payload: CreateInvitationPayload): Observable<Invitation> {
    return this.http.post<Invitation>(this.baseUrl, payload);
  }

  // Lista las invitaciones del organizador autenticado.
  listMine(): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(this.baseUrl);
  }

  getById(id: string): Observable<Invitation> {
    return this.http.get<Invitation>(`${this.baseUrl}/${id}`);
  }

  // Guarda el borrador (contenido del evento + personalización).
  update(id: string, payload: UpdateInvitationPayload): Observable<Invitation> {
    return this.http.patch<Invitation>(`${this.baseUrl}/${id}`, payload);
  }

  // Descarga el PDF imprimible. La petición lleva el token (vía interceptor);
  // recibimos un blob y disparamos la descarga en el navegador.
  downloadPdf(id: string, filename = 'invitacion.pdf', size = 'A5'): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}/${id}/pdf?size=${size}`, { responseType: 'blob' })
      .pipe(
        tap((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        }),
      );
  }
}
