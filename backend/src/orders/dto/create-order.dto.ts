import { IsUUID } from 'class-validator';

// Inicia el pago de la publicación de una invitación.
export class CreateOrderDto {
  @IsUUID('4', { message: 'invitationId no es un identificador válido' })
  invitationId!: string;
}
