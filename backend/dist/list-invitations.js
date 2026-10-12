"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const app_module_1 = require("./app.module");
const user_entity_1 = require("./auth/user.entity");
const invitation_entity_1 = require("./invitations/invitation.entity");
async function run() {
    const email = (process.argv[2] ?? '').toLowerCase().trim();
    if (!email) {
        console.error('Uso: node dist/list-invitations.js correo@ejemplo.com');
        process.exit(1);
    }
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const users = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
        const invitations = app.get((0, typeorm_1.getRepositoryToken)(invitation_entity_1.Invitation));
        const user = await users.findOne({ where: { email } });
        if (!user) {
            console.log(`• ${email}: no existe ninguna cuenta con ese correo.`);
            process.exit(1);
        }
        const list = await invitations.find({
            where: { ownerId: user.id },
            order: { createdAt: 'DESC' },
        });
        console.log(`Cuenta: ${email} (id ${user.id}, rol ${user.role})`);
        console.log(`Invitaciones encontradas: ${list.length}`);
        for (const inv of list) {
            const title = inv.event?.title || '(sin título)';
            console.log(`- ${inv.id} | ${inv.status} | "${title}" | creada ${inv.createdAt?.toISOString?.() ?? inv.createdAt}`);
        }
    }
    finally {
        await app.close();
    }
}
run().catch((err) => {
    console.error('Error al listar invitaciones:', err);
    process.exit(1);
});
//# sourceMappingURL=list-invitations.js.map