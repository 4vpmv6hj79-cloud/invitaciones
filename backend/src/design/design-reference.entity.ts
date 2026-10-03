import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DesignRequest } from './design-request.entity';

// Imagen de referencia adjunta a una solicitud de diseño.
// En desarrollo el archivo vive en disco (uploads/); en producción iría a object storage.
@Entity('design_references')
export class DesignReference {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => DesignRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_id' })
  request!: DesignRequest;

  @Column({ name: 'request_id', type: 'uuid' })
  requestId!: string;

  // Nombre del archivo en disco (no la ruta completa, para poder cambiar el backend de storage).
  @Column()
  filename!: string;

  // Ruta pública relativa para servir la imagen (p. ej. /uploads/xxxx.jpg).
  @Column()
  url!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
