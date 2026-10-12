"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const app_module_1 = require("./app.module");
const user_entity_1 = require("./auth/user.entity");
const invitation_entity_1 = require("./invitations/invitation.entity");
const guest_entity_1 = require("./guests/guest.entity");
async function run() {
    const token = (process.argv[2] ?? '').trim();
    const email = (process.argv[3] ?? '').toLowerCase().trim();
    if (!token || !email) {
        console.error('Uso: node dist/reassign-invitation.js <token> correo-destino@ejemplo.com');
        process.exit(1);
    }
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const users = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
        const invitations = app.get((0, typeorm_1.getRepositoryToken)(invitation_entity_1.Invitation));
        const guests = app.get((0, typeorm_1.getRepositoryToken)(guest_entity_1.Guest));
        const target = await users.findOne({ where: { email } });
        if (!target) {
            console.log(`• ${email}: no existe ninguna cuenta con ese correo. Regístrala primero.`);
            process.exit(1);
        }
        let invitation = null;
        const guest = await guests.findOne({ where: { accessToken: token } });
        if (guest) {
            invitation = await invitations.findOne({ where: { id: guest.invitationId } });
        }
        if (!invitation) {
            invitation = await invitations.findOne({ where: { publicToken: token } });
        }
        if (!invitation) {
            console.log('No se encontró ninguna invitación para ese token.');
            process.exit(1);
        }
        const previousOwner = invitation.ownerId ?? '(sin dueño)';
        invitation.ownerId = target.id;
        await invitations.save(invitation);
        const title = invitation.event?.title || '(sin título)';
        console.log(`✓ Invitación "${title}" (${invitation.id}) reasignada.`);
        console.log(`  Dueño anterior: ${previousOwner}`);
        console.log(`  Nuevo dueño:    ${target.email} (${target.id})`);
        console.log('Ahora aparecerá en "Mis invitaciones" de esa cuenta.');
    }
    finally {
        await app.close();
    }
}
run().catch((err) => {
    console.error('Error al reasignar la invitación:', err);
    process.exit(1);
});
//# sourceMappingURL=reassign-invitation.js.map