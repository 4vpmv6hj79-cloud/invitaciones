// Modelos del catálogo, alineados con la API del backend.

export type TemplateFormat = 'web' | 'image';

export interface TemplateTheme {
  primary?: string;
  secondary?: string;
  background?: string;
  headingFont?: string;
  bodyFont?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  eventTypes: string[];
  format: TemplateFormat;
  style: string;
  previewUrl: string;
  theme: TemplateTheme;
  schema: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Opción de filtro (value + etiqueta legible), tal como la devuelve /templates/filters.
export interface FilterOption {
  value: string;
  label: string;
}

export interface CatalogFilters {
  eventTypes: FilterOption[];
  formats: FilterOption[];
  styles: FilterOption[];
}

// Filtros seleccionados por el usuario (todos opcionales).
export interface SelectedFilters {
  eventType?: string;
  style?: string;
  format?: string;
}

// Datos para crear una plantilla desde el panel de administración.
export interface CreateTemplatePayload {
  name: string;
  description?: string;
  eventTypes: string[];
  format: TemplateFormat;
  style: string;
  previewUrl?: string;
  isActive?: boolean;
}
