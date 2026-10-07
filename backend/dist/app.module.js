"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const health_module_1 = require("./health/health.module");
const templates_module_1 = require("./templates/templates.module");
const invitations_module_1 = require("./invitations/invitations.module");
const orders_module_1 = require("./orders/orders.module");
const guests_module_1 = require("./guests/guests.module");
const auth_module_1 = require("./auth/auth.module");
const tickets_module_1 = require("./tickets/tickets.module");
const design_module_1 = require("./design/design.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const asBool = (value) => {
                        if (!value)
                            return false;
                        const v = value.trim().toLowerCase();
                        return v === 'true' || v === '1' || v === 'yes';
                    };
                    const databaseUrl = config.get('DATABASE_URL');
                    const useSsl = asBool(config.get('DB_SSL'));
                    const ssl = useSsl ? { rejectUnauthorized: false } : undefined;
                    const synchronize = config.get('NODE_ENV') === 'development' ||
                        asBool(config.get('DB_SYNCHRONIZE'));
                    console.log(`[DB] usando ${databaseUrl ? 'DATABASE_URL' : 'variables DB_*'} | ssl=${useSsl} | synchronize=${synchronize}`);
                    if (databaseUrl) {
                        return {
                            type: 'postgres',
                            url: databaseUrl,
                            autoLoadEntities: true,
                            synchronize,
                            ssl,
                        };
                    }
                    return {
                        type: 'postgres',
                        host: config.get('DB_HOST', 'localhost'),
                        port: config.get('DB_PORT', 5432),
                        username: config.get('DB_USER', 'invitaciones'),
                        password: config.get('DB_PASSWORD', 'invitaciones_dev'),
                        database: config.get('DB_NAME', 'invitaciones'),
                        autoLoadEntities: true,
                        synchronize,
                        ssl,
                    };
                },
            }),
            health_module_1.HealthModule,
            templates_module_1.TemplatesModule,
            invitations_module_1.InvitationsModule,
            orders_module_1.OrdersModule,
            guests_module_1.GuestsModule,
            auth_module_1.AuthModule,
            tickets_module_1.TicketsModule,
            design_module_1.DesignModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map