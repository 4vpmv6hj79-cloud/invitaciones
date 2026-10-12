import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { User } from './auth/user.entity';
import { Invitation } from './invitations/invitation.entity';
import { Guest } from './guests/guest.entity';

// Identifica a qué invitación y dueño pertenece un token (uso diagnóstico, solo lectura).
//
// Acepta cualquiera de estos tokens:
//   - accessToken de invitado (enlace /r/:token)
//   - publicToken de la invitación publicada (enlace /i/:token o /p/:token)
//
// Uso:
//   node dist/whois-invitation.js <token>
async function run() {
  const token = (process.argv[2] ?? '').trim();
  if (!token) {
    // eslint-disable-next-line no-console
    console.error('Uso: node dist/whois-invitation.js <token>');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const users = app.get<Repository<User>>(getRepositoryToken(User));
    const invitations = app.get<Repository<Invitation>>(getRepositoryToken(Invitation));
    const guests = app.get<Repository<Guest>>(getRepositoryToken(Guest));

    let invitation: Invitation | null = null;
    let via = '';

    // 1) ¿Es un token de invitado (accessToken)?
    const guest = await guests.findOne({ where: { accessToken: token } });
    if (guest) {
      via = `enlace de invitado (invitado: "${guest.name}")`;
      invitation = await invitations.findOne({ where: { id: guest.invitationId } });
    }

    // 2) Si no, ¿es el publicToken de la invitación?
    if (!invitation) {
      invitation = await invitations.findOne({ where: { publicToken: token } });
      if (invitation) via = 'enlace público de la invitación';
    }

    if (!invitation) {
      // eslint-disable-next-line no-console
      console.log('No se encontró ninguna invitación para ese token.');
      process.exit(1);
    }

    const owner = invitation.ownerId
      ? await users.findOne({ where: { id: invitation.ownerId } })
      : null;

    const title = invitation.event?.title || '(sin título)';
    // eslint-disable-next-line no-console
    console.log('--- Invitación encontrada ---');
    // eslint-disable-next-line no-console
    console.log(`Vía:        ${via}`);
    // eslint-disable-next-line no-console
    console.log(`Invitación: ${invitation.id}`);
    // eslint-disable-next-line no-console
    console.log(`Título:     "${title}"`);
    // eslint-disable-next-line no-console
    console.log(`Estado:     ${invitation.status}`);
    // eslint-disable-next-line no-console
    console.log(`ownerId:    ${invitation.ownerId ?? '(sin dueño)'}`);
    // eslint-disable-next-line no-console
    console.log(`Dueño:      ${owner ? `${owner.email} (rol ${owner.role})` : '(no se encontró el usuario dueño)'}`);
  } finally {
    await app.close();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error:', err);
  process.exit(1);
});
