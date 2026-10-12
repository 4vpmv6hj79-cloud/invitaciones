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
    if (!token) {
        console.error('Uso: node dist/whois-invitation.js <token>');
        process.exit(1);
    }
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const users = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
        const invitations = app.get((0, typeorm_1.getRepositoryToken)(invitation_entity_1.Invitation));
        const guests = app.get((0, typeorm_1.getRepositoryToken)(guest_entity_1.Guest));
        let invitation = null;
        let via = '';
        const guest = await guests.findOne({ where: { accessToken: token } });
        if (guest) {
            via = `enlace de invitado (invitado: "${guest.name}")`;
            invitation = await invitations.findOne({ where: { id: guest.invitationId } });
        }
        if (!invitation) {
            invitation = await invitations.findOne({ where: { publicToken: token } });
            if (invitation)
                via = 'enlace público de la invitación';
        }
        if (!invitation) {
            console.log('No se encontró ninguna invitación para ese token.');
            process.exit(1);
        }
        const owner = invitation.ownerId
            ? await users.findOne({ where: { id: invitation.ownerId } })
            : null;
        const title = invitation.event?.title || '(sin título)';
        console.log('--- Invitación encontrada ---');
        console.log(`Vía:        ${via}`);
        console.log(`Invitación: ${invitation.id}`);
        console.log(`Título:     "${title}"`);
        console.log(`Estado:     ${invitation.status}`);
        console.log(`ownerId:    ${invitation.ownerId ?? '(sin dueño)'}`);
        console.log(`Dueño:      ${owner ? `${owner.email} (rol ${owner.role})` : '(no se encontró el usuario dueño)'}`);
    }
    finally {
        await app.close();
    }
}
run().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
//# sourceMappingURL=whois-invitation.js.map