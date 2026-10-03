import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from '../guests/guest.entity';
import { Invitation } from '../invitations/invitation.entity';
import { User } from '../auth/user.entity';
import { AccessAssignment } from './access-assignment.entity';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guest, Invitation, AccessAssignment, User]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
