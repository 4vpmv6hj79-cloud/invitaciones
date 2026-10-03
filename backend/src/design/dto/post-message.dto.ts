import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// Mensaje en el hilo de una solicitud (comentario del cliente o propuesta del admin).
export class PostMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body!: string;

  // El cliente puede marcar que su mensaje es una solicitud de cambios (cuenta revisión).
  @IsOptional()
  @IsBoolean()
  requestChanges?: boolean;

  // Precio de la propuesta (centavos MXN), solo lo usa el admin al proponer.
  @IsOptional()
  @IsInt()
  @Min(100)
  priceCents?: number;
}
