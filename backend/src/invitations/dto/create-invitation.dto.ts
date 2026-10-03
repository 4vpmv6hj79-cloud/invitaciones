import { IsOptional, IsString, IsUUID } from 'class-validator';

// Crear una invitación-borrador a partir de una plantilla del catálogo.
// El backend copia el theme de la plantilla como punto de partida de la personalización.
export class CreateInvitationDto {
  @IsUUID('4', { message: 'templateId no es un identificador válido' })
  templateId!: string;

  // Título opcional inicial del evento (se puede ajustar luego en el editor).
  @IsOptional()
  @IsString()
  title?: string;
}
