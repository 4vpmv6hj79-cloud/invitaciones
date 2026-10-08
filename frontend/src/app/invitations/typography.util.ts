import { TemplateTheme } from '../catalog/template.model';

// Grupos tipográficos (nivel 2): cada uno puede tener su fuente y escala.
export type TypoGroup = 'title' | 'names' | 'data' | 'message' | 'section';

// Devuelve la fuente efectiva de un grupo: su fuente propia o, si no tiene,
// la general (headingFont para títulos/encabezados, bodyFont para texto).
export function groupFont(c: TemplateTheme | undefined, group: TypoGroup): string {
  if (!c) return 'inherit';
  const heading = c.headingFont || 'serif';
  const body = c.bodyFont || 'sans-serif';
  switch (group) {
    case 'title':
      return c.titleFont || heading;
    case 'names':
      return c.namesFont || heading;
    case 'section':
      return c.sectionHeadingFont || heading;
    case 'data':
      return c.dataFont || body;
    case 'message':
      return c.messageFont || body;
    default:
      return body;
  }
}

// Devuelve la escala efectiva de un grupo (1 = tamaño normal).
export function groupScale(c: TemplateTheme | undefined, group: TypoGroup): number {
  if (!c) return 1;
  const map: Record<TypoGroup, number | undefined> = {
    title: c.titleScale,
    names: c.namesScale,
    data: c.dataScale,
    message: c.messageScale,
    section: c.sectionScale,
  };
  const s = Number(map[group]);
  // Acota a un rango razonable para evitar textos rotos.
  if (!s || isNaN(s)) return 1;
  return Math.min(2, Math.max(0.7, s));
}
