import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

// RSVP desde el enlace público general (/i/:token). El invitado se auto-registra.
export class PublicRsvpDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  seats?: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  dietaryNotes?: string;

  @IsOptional()
  @IsIn(['confirmed', 'declined'])
  status?: 'confirmed' | 'declined';
}
