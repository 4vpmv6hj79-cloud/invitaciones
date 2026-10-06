import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
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
  time?: string; // HH:mm (hora de inicio)

  @IsOptional()
  @IsString()
  @MaxLength(10)
  endTime?: string; // HH:mm (hora de finalización, opcional)

  @IsOptional()
  @IsString()
  @MaxLength(80)
  timezone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  locationName?: string;

  // Enlace de Google Maps del lugar del evento (opcional).
  @IsOptional()
  @IsString()
  @MaxLength(600)
  mapsUrl?: string;

  // Mostrar cuenta regresiva al evento en la invitación (opcional).
  @IsOptional()
  @IsBoolean()
  showCountdown?: boolean;

  // Imagen de portada de la invitación (URL o ruta /uploads/...). Opcional.
  @IsOptional()
  @IsString()
  @MaxLength(600)
  coverImageUrl?: string;

  // Estilo de la portada: 'banner' (arriba), 'fondo' (cubre todo) o 'marco' (retrato).
  @IsOptional()
  @IsString()
  @MaxLength(20)
  coverStyle?: string;

  // Tamaño de la portada (banner/marco): 's' | 'm' | 'l'. (Compatibilidad; ahora se usa coverWidthPct.)
  @IsOptional()
  @IsString()
  @MaxLength(5)
  coverSize?: string;

  // Ancho de la portada como porcentaje del contenedor (40–100). Control fino con deslizador.
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(100)
  coverWidthPct?: number;

  // Tamaño de las fotos de la galería como porcentaje de ancho por foto (20–100).
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(100)
  galleryItemPct?: number;

  // Galería de fotos (URLs o rutas /uploads/...). Máximo 12. Opcional.
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MaxLength(600, { each: true })
  galleryImages?: string[];

  // --- Evento religioso (misa), opcional ---

  // Indica si la invitación incluye un evento religioso.
  @IsOptional()
  @IsBoolean()
  religiousEnabled?: boolean;

  // Si el evento religioso se celebra en el mismo lugar que el evento principal.
  @IsOptional()
  @IsBoolean()
  religiousSameLocation?: boolean;

  // Hora del evento religioso (HH:mm).
  @IsOptional()
  @IsString()
  @MaxLength(10)
  religiousTime?: string;

  // Nombre del lugar del evento religioso (ej. parroquia).
  @IsOptional()
  @IsString()
  @MaxLength(200)
  religiousLocationName?: string;

  // Enlace de Google Maps del evento religioso (cuando es en otro lugar).
  @IsOptional()
  @IsString()
  @MaxLength(600)
  religiousMapsUrl?: string;
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
