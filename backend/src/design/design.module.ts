import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignRequest } from './design-request.entity';
import { DesignMessage } from './design-message.entity';
import { DesignReference } from './design-reference.entity';
import { DesignService } from './design.service';
import { DesignController } from './design.controller';
import { AdminDesignController } from './admin-design.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DesignRequest, DesignMessage, DesignReference])],
  controllers: [DesignController, AdminDesignController],
  providers: [DesignService],
  exports: [DesignService],
})
export class DesignModule {}
