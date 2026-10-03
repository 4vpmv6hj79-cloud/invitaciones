import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { TemplatesModule } from './templates/templates.module';
import { InvitationsModule } from './invitations/invitations.module';
import { OrdersModule } from './orders/orders.module';
import { GuestsModule } from './guests/guests.module';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { DesignModule } from './design/design.module';

@Module({
  imports: [
    // Carga variables de entorno desde .env y las hace disponibles globalmente.
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a PostgreSQL. En esta etapa 0 no hay entidades todavía;
    // se irán agregando por módulo en etapas posteriores.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'invitaciones'),
        password: config.get<string>('DB_PASSWORD', 'invitaciones_dev'),
        database: config.get<string>('DB_NAME', 'invitaciones'),
        autoLoadEntities: true,
        // En desarrollo sincroniza el esquema; en producción se usarán migraciones.
        synchronize: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    HealthModule,
    TemplatesModule,
    InvitationsModule,
    OrdersModule,
    GuestsModule,
    AuthModule,
    TicketsModule,
    DesignModule,
  ],
})
export class AppModule {}
