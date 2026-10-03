import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

// Confirmación de asistencia del invitado (sin cuenta).
export class RsvpDto {
  // 'confirmed' asiste; 'declined' no asiste.
  @IsIn(['confirmed', 'declined'], { message: 'Respuesta no válida' })
  status!: 'confirmed' | 'declined';

  // Lugares que usará (acompañantes incluidos). Se valida contra allowedSeats.
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  seats?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  dietaryNotes?: string;
}
