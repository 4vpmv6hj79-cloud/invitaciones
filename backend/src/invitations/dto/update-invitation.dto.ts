import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

// Contenido del evento editable desde el editor autoservicio.
export class EventDataDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  coupleOrHonoree?: string; // nombres (pareja/festejado)

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;

  @IsOptional()
  @IsString()
  date?: string; // ISO (YYYY-MM-DD)

  @IsOptional()
  @IsString()
  time?: string; // HH:mm

  @IsOptional()
  @IsString()
  @MaxLength(80)
  timezone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  locationName?: string;
}

// Actualización del borrador: título, contenido del evento y personalización del diseño.
export class UpdateInvitationDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventDataDto)
  eventData?: EventDataDto;

  // Personalización del diseño (colores, tipografías). Objeto flexible.
  @IsOptional()
  @IsObject()
  customization?: Record<string, unknown>;
}
