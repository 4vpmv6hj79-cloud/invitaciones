import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { User } from './auth/user.entity';
import { Invitation } from './invitations/invitation.entity';

// Lista las invitaciones de una cuenta (uso administrativo/diagnóstico).
//
// Uso:
//   node dist/list-invitations.js correo@ejemplo.com
//
// Muestra, por cada invitación de ese usuario: id, estado, título y fechas.
// No modifica nada; solo lee.
async function run() {
  const email = (process.argv[2] ?? '').toLowerCase().trim();

  if (!email) {
    // eslint-disable-next-line no-console
    console.error('Uso: node dist/list-invitations.js correo@ejemplo.com');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const users = app.get<Repository<User>>(getRepositoryToken(User));
    const invitations = app.get<Repository<Invitation>>(getRepositoryToken(Invitation));

    const user = await users.findOne({ where: { email } });
    if (!user) {
      // eslint-disable-next-line no-console
      console.log(`• ${email}: no existe ninguna cuenta con ese correo.`);
      process.exit(1);
    }

    const list = await invitations.find({
      where: { ownerId: user.id },
      order: { createdAt: 'DESC' },
    });

    // eslint-disable-next-line no-console
    console.log(`Cuenta: ${email} (id ${user.id}, rol ${user.role})`);
    // eslint-disable-next-line no-console
    console.log(`Invitaciones encontradas: ${list.length}`);
    for (const inv of list) {
      const title = inv.event?.title || '(sin título)';
      // eslint-disable-next-line no-console
      console.log(
        `- ${inv.id} | ${inv.status} | "${title}" | creada ${inv.createdAt?.toISOString?.() ?? inv.createdAt}`,
      );
    }
  } finally {
    await app.close();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error al listar invitaciones:', err);
  process.exit(1);
});
