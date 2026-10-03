import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Public } from '../auth/decorators';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  // Endpoint de salud: confirma que la API responde y que la base de datos
  // acepta consultas. Útil como primer verificable y para monitoreo.
  @Public()
  @Get()
  async check() {
    let database = 'down';
    try {
      await this.dataSource.query('SELECT 1');
      database = 'up';
    } catch {
      database = 'down';
    }

    return {
      status: database === 'up' ? 'ok' : 'degraded',
      service: 'invitaciones-backend',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
