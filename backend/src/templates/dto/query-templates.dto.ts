import { IsEnum, IsOptional } from 'class-validator';
import { EventType, TemplateFormat, TemplateStyle } from '../template.enums';

// Parámetros de filtrado del catálogo. Todos opcionales: sin filtros se devuelve todo lo activo.
export class QueryTemplatesDto {
  @IsOptional()
  @IsEnum(EventType, { message: 'Tipo de evento no válido' })
  eventType?: EventType;

  @IsOptional()
  @IsEnum(TemplateStyle, { message: 'Estilo no válido' })
  style?: TemplateStyle;

  @IsOptional()
  @IsEnum(TemplateFormat, { message: 'Formato no válido' })
  format?: TemplateFormat;
}
