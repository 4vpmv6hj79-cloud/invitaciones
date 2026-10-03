import { EventType, TemplateFormat, TemplateStyle } from './template.enums';

// Datos semilla del catálogo inicial: una plantilla web por tipo de evento.
// Los colores y tipografías usan recursos de uso comercial libre (Google Fonts).
// previewUrl queda vacío por ahora (se generará con el render en etapas posteriores).
export interface SeedTemplate {
  name: string;
  description: string;
  eventTypes: EventType[];
  format: TemplateFormat;
  style: TemplateStyle;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    headingFont: string;
    bodyFont: string;
  };
}

export const SEED_TEMPLATES: SeedTemplate[] = [
  {
    name: 'Bodas de Oro — Dorado Clásico',
    description:
      'Plantilla elegante para celebrar 50 años de matrimonio, con acabados dorados y tipografía serif.',
    eventTypes: [EventType.BodaDeOro],
    format: TemplateFormat.Web,
    style: TemplateStyle.Elegante,
    theme: {
      primary: '#b8860b',
      secondary: '#7a5c13',
      background: '#fbf7ef',
      headingFont: 'Playfair Display',
      bodyFont: 'Lato',
    },
  },
  {
    name: 'Boda — Jardín Romántico',
    description: 'Diseño floral y delicado para bodas, con tonos suaves y acentos botánicos.',
    eventTypes: [EventType.Boda],
    format: TemplateFormat.Web,
    style: TemplateStyle.Floral,
    theme: {
      primary: '#c98a9a',
      secondary: '#8a5a66',
      background: '#fdf6f6',
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Nunito Sans',
    },
  },
  {
    name: 'Aniversario — Elegancia Serena',
    description: 'Plantilla sobria y atemporal para aniversarios de pareja.',
    eventTypes: [EventType.Aniversario],
    format: TemplateFormat.Web,
    style: TemplateStyle.Elegante,
    theme: {
      primary: '#4a6670',
      secondary: '#2f444c',
      background: '#f4f7f8',
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Lato',
    },
  },
  {
    name: 'XV Años — Rosa Encantado',
    description: 'Diseño festivo y juvenil para quinceañeras, con detalles elegantes.',
    eventTypes: [EventType.XV],
    format: TemplateFormat.Web,
    style: TemplateStyle.Elegante,
    theme: {
      primary: '#d6336c',
      secondary: '#9c2456',
      background: '#fff5f8',
      headingFont: 'Playfair Display',
      bodyFont: 'Poppins',
    },
  },
  {
    name: 'Cumpleaños — Confeti Moderno',
    description: 'Plantilla alegre y minimalista para cumpleaños de cualquier edad.',
    eventTypes: [EventType.Cumpleanos],
    format: TemplateFormat.Web,
    style: TemplateStyle.Moderno,
    theme: {
      primary: '#5c7cfa',
      secondary: '#3b5bdb',
      background: '#f5f7ff',
      headingFont: 'Poppins',
      bodyFont: 'Inter',
    },
  },
  {
    name: 'Fiesta Infantil — Globos Alegres',
    description: 'Diseño colorido y divertido para fiestas de niñas y niños.',
    eventTypes: [EventType.FiestaInfantil],
    format: TemplateFormat.Web,
    style: TemplateStyle.Infantil,
    theme: {
      primary: '#f783ac',
      secondary: '#4dabf7',
      background: '#fffdf5',
      headingFont: 'Baloo 2',
      bodyFont: 'Nunito',
    },
  },
  {
    name: 'Bautizo — Nube Celeste',
    description: 'Plantilla tierna y luminosa para la celebración del bautizo.',
    eventTypes: [EventType.Bautizo],
    format: TemplateFormat.Web,
    style: TemplateStyle.Floral,
    theme: {
      primary: '#74c0fc',
      secondary: '#4a90c2',
      background: '#f6fbff',
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Nunito Sans',
    },
  },
  {
    name: 'Primera Comunión — Luz Serena',
    description: 'Diseño sobrio y luminoso para la primera comunión.',
    eventTypes: [EventType.PrimeraComunion],
    format: TemplateFormat.Web,
    style: TemplateStyle.Elegante,
    theme: {
      primary: '#c0a062',
      secondary: '#8a7340',
      background: '#fbf9f3',
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Lato',
    },
  },
  {
    name: 'Graduación — Logro Moderno',
    description: 'Plantilla moderna y limpia para celebrar una graduación.',
    eventTypes: [EventType.Graduacion],
    format: TemplateFormat.Web,
    style: TemplateStyle.Moderno,
    theme: {
      primary: '#1c7ed6',
      secondary: '#1864ab',
      background: '#f4f9ff',
      headingFont: 'Poppins',
      bodyFont: 'Inter',
    },
  },
  {
    name: 'Baby Shower — Dulce Espera',
    description: 'Diseño suave y acogedor para dar la bienvenida al bebé.',
    eventTypes: [EventType.BabyShower],
    format: TemplateFormat.Web,
    style: TemplateStyle.Infantil,
    theme: {
      primary: '#ffa8a8',
      secondary: '#f4c2c2',
      background: '#fffafa',
      headingFont: 'Baloo 2',
      bodyFont: 'Nunito',
    },
  },
  {
    name: 'Despedida — Última Fiesta',
    description: 'Plantilla moderna y vibrante para despedidas de soltera o soltero.',
    eventTypes: [EventType.Despedida],
    format: TemplateFormat.Web,
    style: TemplateStyle.Moderno,
    theme: {
      primary: '#7048e8',
      secondary: '#5f3dc4',
      background: '#f8f5ff',
      headingFont: 'Poppins',
      bodyFont: 'Inter',
    },
  },
  {
    name: 'Evento Personalizado — Lienzo Neutro',
    description: 'Plantilla versátil y corporativa para cualquier evento no listado.',
    eventTypes: [EventType.Personalizado],
    format: TemplateFormat.Web,
    style: TemplateStyle.Corporativo,
    theme: {
      primary: '#343a40',
      secondary: '#495057',
      background: '#f8f9fa',
      headingFont: 'Montserrat',
      bodyFont: 'Inter',
    },
  },
];
