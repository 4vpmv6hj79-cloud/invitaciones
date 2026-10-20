import { PlanId } from './invitation.model';

// Claves de función (espejo de backend/src/invitations/plans.ts).
export type FeatureKey =
  | 'cover'
  | 'countdown'
  | 'location'
  | 'dressCode'
  | 'gift'
  | 'gallery'
  | 'rsvp'
  | 'music'
  | 'guestPasses'
  | 'religious'
  | 'parents'
  | 'lodging'
  | 'recommendations'
  | 'weather'
  | 'sectionImages'
  | 'ticketsQr';

// Qué funciones habilita cada plan (debe coincidir con el backend).
const PLAN_FEATURES: Record<PlanId, FeatureKey[]> = {
  esencial: ['cover', 'countdown', 'location', 'dressCode', 'gift', 'gallery', 'rsvp'],
  premium: [
    'cover',
    'countdown',
    'location',
    'dressCode',
    'gift',
    'gallery',
    'rsvp',
    'music',
    'guestPasses',
    'religious',
    'parents',
    'lodging',
    'recommendations',
    'weather',
    'sectionImages',
  ],
  platinum: [
    'cover',
    'countdown',
    'location',
    'dressCode',
    'gift',
    'gallery',
    'rsvp',
    'music',
    'guestPasses',
    'religious',
    'parents',
    'lodging',
    'recommendations',
    'weather',
    'sectionImages',
    'ticketsQr',
  ],
};

// Orden de planes (de menor a mayor), para saber "a qué plan subir".
export const PLAN_ORDER: PlanId[] = ['esencial', 'premium', 'platinum'];

export const PLAN_NAMES: Record<PlanId, string> = {
  esencial: 'Esencial',
  premium: 'Premium',
  platinum: 'Platinum QR',
};

// ¿El plan dado incluye la función?
export function planHasFeature(plan: PlanId, feature: FeatureKey): boolean {
  return PLAN_FEATURES[plan].includes(feature);
}

// Primer plan (el más económico) que incluye la función. Útil para decir
// "disponible en el plan X".
export function minPlanFor(feature: FeatureKey): PlanId {
  for (const plan of PLAN_ORDER) {
    if (PLAN_FEATURES[plan].includes(feature)) return plan;
  }
  return 'platinum';
}

// Etiqueta legible de cada función (para mostrar "las diferencias" en el popup).
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  cover: 'Portada personalizada',
  countdown: 'Cuenta regresiva',
  location: 'Ubicación con mapa',
  dressCode: 'Código de vestimenta',
  gift: 'Mesa de regalos',
  gallery: 'Galería de fotos',
  rsvp: 'Confirmación de asistencia',
  music: 'Música de fondo',
  guestPasses: 'Pases y cupos por invitado',
  religious: 'Evento religioso',
  parents: 'Padres y padrinos',
  lodging: 'Hospedaje',
  recommendations: 'Recomendaciones',
  weather: 'Clima',
  sectionImages: 'Imágenes entre secciones',
  ticketsQr: 'Boletos QR y control de acceso',
};

// Lista de funciones que un plan agrega respecto a otro plan base.
export function featuresAddedBy(plan: PlanId, base: PlanId): FeatureKey[] {
  const baseSet = new Set(PLAN_FEATURES[base]);
  return PLAN_FEATURES[plan].filter((f) => !baseSet.has(f));
}

// Dado el plan actual y una función bloqueada, devuelve las opciones de mejora
// válidas (planes que SÍ incluyen la función y son superiores al actual), con
// el detalle de lo que cada uno agrega respecto al plan actual.
export interface UpgradeOption {
  id: PlanId;
  name: string;
  addedFeatures: FeatureKey[]; // qué suma respecto al plan actual
}

export function upgradeOptionsFor(current: PlanId, feature: FeatureKey): PlanId[] {
  const currentIndex = PLAN_ORDER.indexOf(current);
  return PLAN_ORDER.filter((plan, idx) => {
    return idx > currentIndex && PLAN_FEATURES[plan].includes(feature);
  });
}
