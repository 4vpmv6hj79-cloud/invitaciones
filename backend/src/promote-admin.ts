import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { User, UserRole } from './auth/user.entity';

// Promueve usuarios a administrador (o los crea como admin si no existen).
//
// Uso:
//   npm run promote-admin -- correo1@ejemplo.com correo2@ejemplo.com
//
// Si una cuenta no existe todavía, se crea como admin con la contraseña
// definida en la variable de entorno ADMIN_DEFAULT_PASSWORD (si está presente).
// Si la cuenta ya existe, solo se cambia su rol a admin (no se toca su contraseña).
async function run() {
  const emails = process.argv.slice(2).map((e) => e.toLowerCase().trim()).filter(Boolean);

  if (emails.length === 0) {
    // eslint-disable-next-line no-console
    console.error('Debes indicar al menos un correo. Ej: npm run promote-admin -- correo@ejemplo.com');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const users = app.get<Repository<User>>(getRepositoryToken(User));
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;

    for (const email of emails) {
      const existing = await users.findOne({ where: { email } });

      if (existing) {
        existing.role = UserRole.Admin;
        await users.save(existing);
        // eslint-disable-next-line no-console
        console.log(`✓ ${email}: cuenta existente promovida a ADMIN.`);
        continue;
      }

      if (!defaultPassword) {
        // eslint-disable-next-line no-console
        console.log(
          `• ${email}: no existe. Pídele que se registre primero, o define ADMIN_DEFAULT_PASSWORD para crearla como admin.`,
        );
        continue;
      }

      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      await users.save(
        users.create({
          email,
          passwordHash,
          name: email.split('@')[0],
          role: UserRole.Admin,
        }),
      );
      // eslint-disable-next-line no-console
      console.log(`✓ ${email}: cuenta creada como ADMIN con la contraseña temporal indicada.`);
    }

    // eslint-disable-next-line no-console
    console.log('Listo. Los usuarios promovidos deben cerrar sesión y volver a entrar para obtener un token con rol admin.');
  } finally {
    await app.close();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error al promover administradores:', err);
  process.exit(1);
});
