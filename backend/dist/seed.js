"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const templates_service_1 = require("./templates/templates.service");
async function run() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const templates = app.get(templates_service_1.TemplatesService);
        const result = await templates.seed();
        console.log(`Seed completado: ${result.inserted} plantillas nuevas. Total en catálogo: ${result.total}.`);
    }
    finally {
        await app.close();
    }
}
run().catch((err) => {
    console.error('Error al sembrar:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map