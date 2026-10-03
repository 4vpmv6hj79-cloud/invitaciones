import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EventType, TemplateFormat, TemplateStyle } from '../template.enums';

// Datos para crear una plantilla desde el panel de administración.
export class CreateTemplateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Indica al menos un tipo de evento' })
  @IsEnum(EventType, { each: true, message: 'Tipo de evento no válido' })
  eventTypes!: EventType[];

  @IsEnum(TemplateFormat, { message: 'Formato no válido' })
  format!: TemplateFormat;

  @IsEnum(TemplateStyle, { message: 'Estilo no válido' })
  style!: TemplateStyle;

  @IsOptional()
  @IsString()
  previewUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
