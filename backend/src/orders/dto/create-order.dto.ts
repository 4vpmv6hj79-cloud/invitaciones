import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

// Inicia el pago de la publicación de una invitación.
export class CreateOrderDto {
  @IsUUID('4', { message: 'invitationId no es un identificador válido' })
  invitationId!: string;

  // Plan elegido para la publicación. Opcional por compatibilidad; si no llega,
  // el servicio usa un plan por defecto.
  @IsOptional()
  @IsString()
  @IsIn(['esencial', 'premium', 'platinum'], { message: 'Plan no válido' })
  plan?: string;
}
