import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './guest.entity';
import { GuestGroup } from './guest-group.entity';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { RsvpController } from './rsvp.controller';
import { InvitationsModule } from '../invitations/invitations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guest, GuestGroup]),
    InvitationsModule,
  ],
  controllers: [GuestsController, RsvpController],
  providers: [GuestsService],
  exports: [GuestsService],
})
export class GuestsModule {}
