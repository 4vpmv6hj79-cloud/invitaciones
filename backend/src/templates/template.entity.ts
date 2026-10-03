import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventType, TemplateFormat, TemplateStyle } from './template.enums';

// Definición de una plantilla del catálogo.
// Separa el DISEÑO (esta entidad) del CONTENIDO del evento (otra entidad, en etapas posteriores).
@Entity('templates')
export class TemplateDefinition {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120 })
  name!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  // Tipos de evento para los que aplica la plantilla (una plantilla puede servir a varios).
  @Column({ type: 'enum', enum: EventType, array: true })
  eventTypes!: EventType[];

  // Formato de entrega: web o imagen en el MVP.
  @Column({ type: 'enum', enum: TemplateFormat })
  format!: TemplateFormat;

  // Estilo visual, para filtrar en el catálogo.
  @Column({ type: 'enum', enum: TemplateStyle })
  style!: TemplateStyle;

  // Imagen de vista previa del catálogo (URL en object storage; en el seed es un placeholder).
  @Column({ type: 'text', default: '' })
  previewUrl!: string;

  // Definición de los campos editables de la plantilla (estructura flexible por formato).
  @Column({ type: 'jsonb', default: {} })
  schema!: Record<string, unknown>;

  // Paleta base de la plantilla, para render del ejemplo (colores, tipografías de Google Fonts).
  @Column({ type: 'jsonb', default: {} })
  theme!: Record<string, unknown>;

  // Permite publicar/retirar una plantilla sin borrarla.
  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
