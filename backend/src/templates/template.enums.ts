// Enums compartidos del dominio de plantillas.
// Se mantienen como listas de datos para poder ampliarlos sin reconstruir la plataforma.

// Tipos de evento soportados. "custom" es el comodín para eventos no listados.
export enum EventType {
  Boda = 'boda',
  BodaDeOro = 'boda_de_oro',
  Aniversario = 'aniversario',
  XV = 'xv',
  Cumpleanos = 'cumpleanos',
  FiestaInfantil = 'fiesta_infantil',
  Bautizo = 'bautizo',
  PrimeraComunion = 'primera_comunion',
  Graduacion = 'graduacion',
  BabyShower = 'baby_shower',
  Despedida = 'despedida',
  Personalizado = 'personalizado',
}

// Formatos de entrega. En el MVP solo web e imagen; pdf y video llegan en fases posteriores.
export enum TemplateFormat {
  Web = 'web',
  Image = 'image',
}

// Estilos visuales, usados como etiqueta de filtrado (transversales al tipo de evento).
export enum TemplateStyle {
  Elegante = 'elegante',
  Moderno = 'moderno',
  Infantil = 'infantil',
  Floral = 'floral',
  Corporativo = 'corporativo',
}

// Etiquetas legibles para mostrar en la interfaz (español).
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  [EventType.Boda]: 'Boda',
  [EventType.BodaDeOro]: 'Boda de oro',
  [EventType.Aniversario]: 'Aniversario',
  [EventType.XV]: 'XV años',
  [EventType.Cumpleanos]: 'Cumpleaños',
  [EventType.FiestaInfantil]: 'Fiesta infantil',
  [EventType.Bautizo]: 'Bautizo',
  [EventType.PrimeraComunion]: 'Primera comunión',
  [EventType.Graduacion]: 'Graduación',
  [EventType.BabyShower]: 'Baby shower',
  [EventType.Despedida]: 'Despedida',
  [EventType.Personalizado]: 'Evento personalizado',
};

export const TEMPLATE_FORMAT_LABELS: Record<TemplateFormat, string> = {
  [TemplateFormat.Web]: 'Invitación web',
  [TemplateFormat.Image]: 'Imagen para compartir',
};

export const TEMPLATE_STYLE_LABELS: Record<TemplateStyle, string> = {
  [TemplateStyle.Elegante]: 'Elegante',
  [TemplateStyle.Moderno]: 'Moderno / minimalista',
  [TemplateStyle.Infantil]: 'Infantil',
  [TemplateStyle.Floral]: 'Floral / romántico',
  [TemplateStyle.Corporativo]: 'Corporativo',
};
