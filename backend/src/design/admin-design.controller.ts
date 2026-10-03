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
import { DesignService } from './design.service';
import { DesignStatus } from './design-request.entity';
import { PostMessageDto } from './dto/post-message.dto';
import { CurrentUser, Roles } from '../auth/decorators';
import { UserRole } from '../auth/user.entity';

type AuthUser = { id: string; role: UserRole };

// Bandeja de solicitudes de diseño para el admin.
@Roles(UserRole.Admin)
@Controller('admin/design-requests')
export class AdminDesignController {
  constructor(private readonly service: DesignService) {}

  @Get()
  list(@Query('status') status?: DesignStatus) {
    return this.service.listAll(status);
  }

  @Get(':id')
  getThread(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthUser) {
    return this.service.getThread(id, user);
  }

  @Get(':id/references')
  listReferences(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthUser) {
    return this.service.listReferences(id, user);
  }

  @Patch(':id/status')
  setStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('status') status: DesignStatus,
  ) {
    return this.service.setStatus(id, status);
  }

  // Envía propuesta con precio (en centavos de MXN).
  @Post(':id/proposal')
  addProposal(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: PostMessageDto,
    @Body('priceCents') priceCents: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.addProposal(id, user.id, dto, Number(priceCents));
  }
}
