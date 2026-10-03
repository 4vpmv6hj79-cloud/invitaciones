import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// Alta de un invitado individual (o miembro de un grupo).
export class CreateGuestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  contact?: string;

  @IsInt()
  @Min(1)
  @Max(50)
  allowedSeats!: number;

  @IsOptional()
  @IsUUID('4')
  groupId?: string;
}
