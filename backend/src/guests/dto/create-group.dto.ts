import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

// Alta de un grupo/familia de invitados.
export class CreateGroupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  allowedSeats!: number;
}
