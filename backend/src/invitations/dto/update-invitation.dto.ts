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

  // Modo de confirmación en el enlace público: 'abierto' (el invitado elige cuántos)
  // o 'cerrado' (confirma con un número fijo de acompañantes definido por el organizador).
  @IsOptional()
  @IsString()
  @MaxLength(10)
  rsvpMode?: string;

  // Número de acompañantes (adicionales al invitado) en el modo 'cerrado'.
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  rsvpCompanions?: number;

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

  // Título personalizable de la sección religiosa (ej. "Misa", "Ceremonia").
  // Si está vacío, se usa "Evento religioso".
  @IsOptional()
  @IsString()
  @MaxLength(60)
  religiousTitle?: string;

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

  // --- Galería en mosaico ---
  // Si la galería se muestra en estilo mosaico (masonry) en vez de cuadrícula uniforme.
  @IsOptional()
  @IsBoolean()
  galleryMosaic?: boolean;

  // --- Código de vestimenta (opcional) ---
  @IsOptional()
  @IsString()
  @MaxLength(120)
  dressCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  dressCodeNote?: string;

  // Imágenes de ejemplo del código de vestimenta (URLs o /uploads/...). Máx 6.
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  @IsString({ each: true })
  @MaxLength(600, { each: true })
  dressCodeImages?: string[];

  // --- Mesa de regalos (texto libre: mesas, transferencia, sobres) ---
  @IsOptional()
  @IsString()
  @MaxLength(1500)
  giftInfo?: string;
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
