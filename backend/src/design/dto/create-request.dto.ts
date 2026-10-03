import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// Solicitud de diseño a medida creada por el cliente.
export class CreateRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  eventType!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  style?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  details!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  budget?: string;
}
