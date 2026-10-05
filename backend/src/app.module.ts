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

    // Conexión a PostgreSQL.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Normaliza valores booleanos de variables de entorno: tolera
        // espacios, mayúsculas y valores como "true"/"1"/"yes".
        const asBool = (value: string | undefined): boolean => {
          if (!value) return false;
          const v = value.trim().toLowerCase();
          return v === 'true' || v === '1' || v === 'yes';
        };

        // Railway (y otros PaaS) entregan la conexión como una sola URL en DATABASE_URL.
        // Si existe, la usamos; si no, caemos a las variables separadas (desarrollo local).
        const databaseUrl = config.get<string>('DATABASE_URL');

        // SSL es necesario en varios proveedores gestionados. Se activa con DB_SSL=true.
        const useSsl = asBool(config.get<string>('DB_SSL'));
        const ssl = useSsl ? { rejectUnauthorized: false } : undefined;

        // synchronize crea/actualiza el esquema automáticamente a partir de las entidades.
        // En desarrollo siempre; en producción solo si DB_SYNCHRONIZE=true (útil para el MVP).
        const synchronize =
          config.get<string>('NODE_ENV') === 'development' ||
          asBool(config.get<string>('DB_SYNCHRONIZE'));

        // Log de diagnóstico: deja claro en los logs de arranque cómo quedó la conexión.
        // eslint-disable-next-line no-console
        console.log(
          `[DB] usando ${databaseUrl ? 'DATABASE_URL' : 'variables DB_*'} | ssl=${useSsl} | synchronize=${synchronize}`,
        );

        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize,
            ssl,
          };
        }

        return {
          type: 'postgres' as const,
          host: config.get<string>('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', 5432),
          username: config.get<string>('DB_USER', 'invitaciones'),
          password: config.get<string>('DB_PASSWORD', 'invitaciones_dev'),
          database: config.get<string>('DB_NAME', 'invitaciones'),
          autoLoadEntities: true,
          synchronize,
          ssl,
        };
      },
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
