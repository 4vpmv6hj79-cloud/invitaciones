// Definición central de los planes de publicación de invitaciones.
// Única fuente de verdad del backend para precios y funciones por plan.

export type PlanId = 'esencial' | 'premium' | 'platinum';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceCents: number; // precio en centavos de MXN
  // Funciones que habilita el plan (se usarán en la Fase 2 para bloquear/permitir).
  features: string[];
}

// Precios acordados (MXN): Esencial $699, Premium $1,299, Platinum $1,899.
export const PLANS: Record<PlanId, PlanDefinition> = {
  esencial: {
    id: 'esencial',
    name: 'Esencial',
    priceCents: 69900,
    features: [
      'cover',
      'countdown',
      'location',
      'dressCode',
      'gift',
      'gallery',
      'rsvp',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceCents: 129900,
    features: [
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
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum QR',
    priceCents: 189900,
    features: [
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
  },
};

// Devuelve la definición del plan, con 'premium' como valor por defecto seguro
// si llega un id desconocido.
export function getPlan(id: string | undefined | null): PlanDefinition {
  if (id && (id === 'esencial' || id === 'premium' || id === 'platinum')) {
    return PLANS[id];
  }
  return PLANS.premium;
}

export function isValidPlan(id: string | undefined | null): id is PlanId {
  return id === 'esencial' || id === 'premium' || id === 'platinum';
}
