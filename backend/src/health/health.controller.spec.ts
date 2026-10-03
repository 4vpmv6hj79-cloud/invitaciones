import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  // DataSource simulado: no requiere una base de datos real para la prueba unitaria.
  const mockDataSource = {
    query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: getDataSourceToken(), useValue: mockDataSource }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('reporta status ok cuando la base de datos responde', async () => {
    const result = await controller.check();
    expect(result.status).toBe('ok');
    expect(result.database).toBe('up');
    expect(result.service).toBe('invitaciones-backend');
  });

  it('reporta degraded cuando la base de datos falla', async () => {
    mockDataSource.query.mockRejectedValueOnce(new Error('db down'));
    const result = await controller.check();
    expect(result.status).toBe('degraded');
    expect(result.database).toBe('down');
  });
});
