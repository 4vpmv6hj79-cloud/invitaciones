import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { QueryTemplatesDto } from './dto/query-templates.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import {
  EVENT_TYPE_LABELS,
  TEMPLATE_FORMAT_LABELS,
  TEMPLATE_STYLE_LABELS,
} from './template.enums';
import { Public, Roles } from '../auth/decorators';
import { UserRole } from '../auth/user.entity';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly service: TemplatesService) {}

  // Catálogo público con filtros. GET /templates?eventType=&style=&format=
  @Public()
  @Get()
  findCatalog(@Query() query: QueryTemplatesDto) {
    return this.service.findCatalog(query);
  }

  // Opciones de filtro para que el frontend arme la UI sin hardcodear etiquetas.
  // GET /templates/filters
  @Public()
  @Get('filters')
  getFilters() {
    const toList = (labels: Record<string, string>) =>
      Object.entries(labels).map(([value, label]) => ({ value, label }));

    return {
      eventTypes: toList(EVENT_TYPE_LABELS),
      formats: toList(TEMPLATE_FORMAT_LABELS),
      styles: toList(TEMPLATE_STYLE_LABELS),
    };
  }

  // --- Administración (solo rol admin) ---

  @Roles(UserRole.Admin)
  @Get('admin/all')
  findAllForAdmin() {
    return this.service.findAllForAdmin();
  }

  @Roles(UserRole.Admin)
  @Post()
  create(@Body() dto: CreateTemplateDto) {
    return this.service.create(dto);
  }

  @Roles(UserRole.Admin)
  @Patch(':id/active')
  setActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.service.setActive(id, isActive);
  }

  // Detalle / vista de ejemplo (público). GET /templates/:id
  // Va al final para no capturar las rutas estáticas de admin.
  @Public()
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }
}
