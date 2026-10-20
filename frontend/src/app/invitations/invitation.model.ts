import { Template, TemplateTheme } from '../catalog/template.model';

// Un padre/madre/padrino listado en la sección de familia.
export interface ParentItem {
  name: string;
  deceased?: boolean; // marca ✝ para honrar a un ser querido fallecido
}

// Un hotel/opción de hospedaje recomendado.
export interface LodgingItem {
  name: string;
  note?: string; // ej. "En el centro", "Enfrente del salón"
  distance?: string; // ej. "A 5 min del lugar"
  reservationCode?: string; // código de reservación con tarifa especial
  mapsUrl?: string; // enlace opcional de ubicación
}

// Una recomendación de lugar dentro de una categoría.
export interface RecommendationItem {
  category: string; // ej. "Comida", "Cena", "Taquerías"
  name: string; // nombre del lugar
  mapsUrl?: string; // enlace opcional de ubicación
}

// Datos bancarios para regalo en efectivo/transferencia.
export interface BankInfo {
  holder?: string; // titular de la cuenta
  bank?: string; // nombre del banco
  clabe?: string; // CLABE / número de cuenta o tarjeta
  note?: string; // nota opcional
}

// Una mesa de regalos / tienda (física o digital).
export interface GiftRegistryItem {
  name: string; // nombre de la tienda (ej. Liverpool, Amazon)
  url?: string; // enlace opcional (tiendas digitales)
  note?: string; // nota opcional (ej. "N.º de evento 12345")
}

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

  // --- Padres / padrinos (sección "Con la bendición de nuestros padres") ---
  parentsTitle?: string; // título de la sección (default: "Con la bendición de nuestros padres")
  parents?: ParentItem[]; // lista de nombres

  // --- Hospedaje (hoteles recomendados) ---
  lodgingTitle?: string; // título de la sección (default: "Hospedaje")
  lodging?: LodgingItem[];

  // --- Recomendaciones de lugares (agrupadas por categoría) ---
  recommendationsTitle?: string; // título de la sección (default: "Recomendaciones")
  recommendationsNote?: string; // texto introductorio opcional
  recommendations?: RecommendationItem[];

  // --- Clima esperado el día del evento (texto fijo editable) ---
  weatherNote?: string;

  // --- Datos bancarios para regalo (dentro de la mesa de regalos) ---
  bankInfo?: BankInfo;

  // --- Mesas de regalo / tiendas (físicas y digitales) ---
  giftRegistries?: GiftRegistryItem[];
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

// Plan de publicación (precio y funciones).
export type PlanId = 'esencial' | 'premium' | 'platinum';
export interface Plan {
  id: PlanId;
  name: string;
  priceCents: number;
  features: string[];
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
