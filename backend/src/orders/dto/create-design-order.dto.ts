import { IsUUID } from 'class-validator';

// Inicia el pago de una solicitud de diseño a medida.
export class CreateDesignOrderDto {
  @IsUUID('4', { message: 'designRequestId no es un identificador válido' })
  designRequestId!: string;
}
