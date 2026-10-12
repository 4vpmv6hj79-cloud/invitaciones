import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { User } from './auth/user.entity';
import { Invitation } from './invitations/invitation.entity';
import { Guest } from './guests/guest.entity';

// Reasigna la propiedad de una invitación a otra cuenta (uso administrativo).
//
// Acepta como token el accessToken de invitado (/r/:token) o el publicToken (/i/:token).
//
// Uso:
//   node dist/reassign-invitation.js <token> correo-destino@ejemplo.com
//
// La cuenta destino debe existir. Solo cambia el ownerId de la invitación;
// no toca su contenido, estado ni enlaces públicos.
async function run() {
  const token = (process.argv[2] ?? '').trim();
  const email = (process.argv[3] ?? '').toLowerCase().trim();

  if (!token || !email) {
    // eslint-disable-next-line no-console
    console.error('Uso: node dist/reassign-invitation.js <token> correo-destino@ejemplo.com');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const users = app.get<Repository<User>>(getRepositoryToken(User));
    const invitations = app.get<Repository<Invitation>>(getRepositoryToken(Invitation));
    const guests = app.get<Repository<Guest>>(getRepositoryToken(Guest));

    const target = await users.findOne({ where: { email } });
    if (!target) {
      // eslint-disable-next-line no-console
      console.log(`• ${email}: no existe ninguna cuenta con ese correo. Regístrala primero.`);
      process.exit(1);
    }

    // Resuelve la invitación por token de invitado o por token público.
    let invitation: Invitation | null = null;
    const guest = await guests.findOne({ where: { accessToken: token } });
    if (guest) {
      invitation = await invitations.findOne({ where: { id: guest.invitationId } });
    }
    if (!invitation) {
      invitation = await invitations.findOne({ where: { publicToken: token } });
    }

    if (!invitation) {
      // eslint-disable-next-line no-console
      console.log('No se encontró ninguna invitación para ese token.');
      process.exit(1);
    }

    const previousOwner = invitation.ownerId ?? '(sin dueño)';
    invitation.ownerId = target.id;
    await invitations.save(invitation);

    const title = invitation.event?.title || '(sin título)';
    // eslint-disable-next-line no-console
    console.log(`✓ Invitación "${title}" (${invitation.id}) reasignada.`);
    // eslint-disable-next-line no-console
    console.log(`  Dueño anterior: ${previousOwner}`);
    // eslint-disable-next-line no-console
    console.log(`  Nuevo dueño:    ${target.email} (${target.id})`);
    // eslint-disable-next-line no-console
    console.log('Ahora aparecerá en "Mis invitaciones" de esa cuenta.');
  } finally {
    await app.close();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error al reasignar la invitación:', err);
  process.exit(1);
});
