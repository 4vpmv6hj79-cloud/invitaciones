import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { User } from './auth/user.entity';

// Restablece la contraseña de una cuenta existente (uso administrativo).
//
// Uso:
//   node dist/reset-password.js correo@ejemplo.com "NuevaContraseña"
//
// Reglas:
//   - La cuenta debe existir (no crea cuentas nuevas).
//   - La contraseña debe tener al menos 8 caracteres (igual que el registro).
//   - No toca el rol ni ningún otro dato: solo cambia el hash de la contraseña.
async function run() {
  const email = (process.argv[2] ?? '').toLowerCase().trim();
  const newPassword = process.argv[3] ?? '';

  if (!email || !newPassword) {
    // eslint-disable-next-line no-console
    console.error(
      'Uso: node dist/reset-password.js correo@ejemplo.com "NuevaContraseña"',
    );
    process.exit(1);
  }

  if (newPassword.length < 8) {
    // eslint-disable-next-line no-console
    console.error('La contraseña debe tener al menos 8 caracteres.');
    process.exit(1);
  }

  if (newPassword.length > 72) {
    // bcrypt trunca a 72 bytes; avisamos para evitar confusiones.
    // eslint-disable-next-line no-console
    console.error('La contraseña no debe exceder 72 caracteres.');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const users = app.get<Repository<User>>(getRepositoryToken(User));
    const user = await users.findOne({ where: { email } });

    if (!user) {
      // eslint-disable-next-line no-console
      console.log(`• ${email}: no existe ninguna cuenta con ese correo.`);
      process.exit(1);
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await users.save(user);

    // eslint-disable-next-line no-console
    console.log(`✓ ${email}: contraseña restablecida. Ya puedes iniciar sesión con la nueva contraseña.`);
  } finally {
    await app.close();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error al restablecer la contraseña:', err);
  process.exit(1);
});
