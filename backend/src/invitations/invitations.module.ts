import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './invitation.entity';
import { Event } from './event.entity';
import { TemplateDefinition } from '../templates/template.entity';
import { InvitationsService } from './invitations.service';
import { PdfService } from './pdf.service';
import { CloudinaryService } from './cloudinary.service';
import { InvitationsController } from './invitations.controller';
import { PublicInvitationController } from './public-invitation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation, Event, TemplateDefinition])],
  controllers: [InvitationsController, PublicInvitationController],
  providers: [InvitationsService, PdfService, CloudinaryService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
