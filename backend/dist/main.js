"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    const config = app.get(config_1.ConfigService);
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), { prefix: '/uploads/' });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const corsOrigin = config.get('CORS_ORIGIN') ?? 'http://localhost:4200';
    const allowedOrigins = corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);
    app.enableCors({ origin: allowedOrigins });
    const port = config.get('PORT') ?? 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`Backend escuchando en el puerto ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map