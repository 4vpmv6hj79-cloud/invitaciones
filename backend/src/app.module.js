"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var health_module_1 = require("./health/health.module");
var templates_module_1 = require("./templates/templates.module");
var invitations_module_1 = require("./invitations/invitations.module");
var orders_module_1 = require("./orders/orders.module");
var guests_module_1 = require("./guests/guests.module");
var auth_module_1 = require("./auth/auth.module");
var tickets_module_1 = require("./tickets/tickets.module");
var design_module_1 = require("./design/design.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                // Carga variables de entorno desde .env y las hace disponibles globalmente.
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                // Conexión a PostgreSQL.
                typeorm_1.TypeOrmModule.forRootAsync({
                    inject: [config_1.ConfigService],
                    useFactory: function (config) {
                        // Normaliza valores booleanos de variables de entorno: tolera
                        // espacios, mayúsculas y valores como "true"/"1"/"yes".
                        var asBool = function (value) {
                            if (!value)
                                return false;
                            var v = value.trim().toLowerCase();
                            return v === 'true' || v === '1' || v === 'yes';
                        };
                        // Railway (y otros PaaS) entregan la conexión como una sola URL en DATABASE_URL.
                        // Si existe, la usamos; si no, caemos a las variables separadas (desarrollo local).
                        var databaseUrl = config.get('DATABASE_URL');
                        // SSL es necesario en varios proveedores gestionados. Se activa con DB_SSL=true.
                        var useSsl = asBool(config.get('DB_SSL'));
                        var ssl = useSsl ? { rejectUnauthorized: false } : undefined;
                        // synchronize crea/actualiza el esquema automáticamente a partir de las entidades.
                        // En desarrollo siempre; en producción solo si DB_SYNCHRONIZE=true (útil para el MVP).
                        var synchronize = config.get('NODE_ENV') === 'development' ||
                            asBool(config.get('DB_SYNCHRONIZE'));
                        // Log de diagnóstico: deja claro en los logs de arranque cómo quedó la conexión.
                        // eslint-disable-next-line no-console
                        console.log("[DB] usando ".concat(databaseUrl ? 'DATABASE_URL' : 'variables DB_*', " | ssl=").concat(useSsl, " | synchronize=").concat(synchronize));
                        if (databaseUrl) {
                            return {
                                type: 'postgres',
                                url: databaseUrl,
                                autoLoadEntities: true,
                                synchronize: synchronize,
                                ssl: ssl,
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
                            synchronize: synchronize,
                            ssl: ssl,
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
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
