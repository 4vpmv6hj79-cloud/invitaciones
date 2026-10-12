import { RecommendationItem } from './invitation.model';

// Un grupo de recomendaciones bajo una misma categoría.
export interface RecommendationGroup {
  category: string;
  items: RecommendationItem[];
}

/**
 * Agrupa una lista de recomendaciones por categoría, conservando el orden de
 * aparición tanto de las categorías como de los lugares dentro de cada una.
 * Los ítems sin nombre se descartan; los sin categoría se agrupan como "Otros".
 */
export function groupRecommendations(items: RecommendationItem[] | undefined): RecommendationGroup[] {
  if (!Array.isArray(items)) return [];
  const groups: RecommendationGroup[] = [];
  const index = new Map<string, RecommendationGroup>();

  for (const item of items) {
    if (!item?.name?.trim()) continue;
    const category = item.category?.trim() || 'Otros';
    let group = index.get(category);
    if (!group) {
      group = { category, items: [] };
      index.set(category, group);
      groups.push(group);
    }
    group.items.push(item);
  }

  return groups;
}
