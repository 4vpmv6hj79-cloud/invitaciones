import { Template, TemplateTheme } from '../catalog/template.model';

// Contenido editable del evento.
export interface EventData {
  coupleOrHonoree?: string;
  message?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  timezone?: string;
  locationName?: string;
}

export interface InvitationEvent {
  id: string;
  type: string;
  title: string;
  data: EventData;
}

// La personalización reutiliza la forma del tema de la plantilla.
export type InvitationCustomization = TemplateTheme;

export interface Invitation {
  id: string;
  templateId: string;
  template: Template;
  eventId: string;
  event: InvitationEvent;
  customization: InvitationCustomization;
  status: 'draft' | 'published';
  ticketsEnabled: boolean;
  publicToken: string | null;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Carga para crear un borrador desde una plantilla.
export interface CreateInvitationPayload {
  templateId: string;
  title?: string;
}

// Carga para guardar el borrador.
export interface UpdateInvitationPayload {
  title?: string;
  eventData?: EventData;
  customization?: InvitationCustomization;
}
