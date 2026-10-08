import { Template, TemplateTheme } from '../catalog/template.model';

// Contenido editable del evento.
export interface EventData {
  coupleOrHonoree?: string;
  message?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm (inicio)
  endTime?: string; // HH:mm (fin, opcional)
  timezone?: string;
  locationName?: string;
  mapsUrl?: string; // enlace de Google Maps del evento
  showCountdown?: boolean; // mostrar cuenta regresiva al evento
  rsvpMode?: 'abierto' | 'cerrado'; // cómo se pregunta la asistencia en el enlace público
  rsvpCompanions?: number; // acompañantes (adicionales al invitado) en modo cerrado
  coverImageUrl?: string; // imagen de portada (URL o /uploads/...)
  coverStyle?: 'banner' | 'fondo' | 'marco'; // cómo se muestra la portada
  coverSize?: 's' | 'm' | 'l'; // (compatibilidad) tamaño de la portada
  coverWidthPct?: number; // ancho de la portada en % (30–100)
  galleryItemPct?: number; // ancho por foto de la galería en % (20–100)
  galleryImages?: string[]; // galería de fotos (URLs o /uploads/...)
  galleryMosaic?: boolean; // galería en estilo mosaico (masonry)

  // Código de vestimenta (opcional).
  dressCode?: string;
  dressCodeNote?: string;
  dressCodeImages?: string[]; // imágenes de ejemplo del dress code

  // Mesa de regalos (texto libre: mesas, transferencia, sobres).
  giftInfo?: string;

  // Música de fondo (enlace de YouTube).
  musicUrl?: string;

  // Imágenes decorativas intercaladas entre secciones.
  sectionImages?: string[];

  // Evento religioso (misa), opcional.
  religiousEnabled?: boolean;
  religiousTitle?: string; // título personalizado de la sección (ej. "Misa")
  religiousSameLocation?: boolean; // true: misma ubicación que el evento
  religiousTime?: string; // HH:mm
  religiousLocationName?: string;
  religiousMapsUrl?: string;
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
