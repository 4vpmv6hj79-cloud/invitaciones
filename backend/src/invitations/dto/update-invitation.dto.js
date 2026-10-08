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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInvitationDto = exports.EventDataDto = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
// Contenido del evento editable desde el editor autoservicio.
var EventDataDto = function () {
    var _a;
    var _coupleOrHonoree_decorators;
    var _coupleOrHonoree_initializers = [];
    var _coupleOrHonoree_extraInitializers = [];
    var _message_decorators;
    var _message_initializers = [];
    var _message_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _time_decorators;
    var _time_initializers = [];
    var _time_extraInitializers = [];
    var _endTime_decorators;
    var _endTime_initializers = [];
    var _endTime_extraInitializers = [];
    var _timezone_decorators;
    var _timezone_initializers = [];
    var _timezone_extraInitializers = [];
    var _locationName_decorators;
    var _locationName_initializers = [];
    var _locationName_extraInitializers = [];
    var _mapsUrl_decorators;
    var _mapsUrl_initializers = [];
    var _mapsUrl_extraInitializers = [];
    var _showCountdown_decorators;
    var _showCountdown_initializers = [];
    var _showCountdown_extraInitializers = [];
    var _rsvpMode_decorators;
    var _rsvpMode_initializers = [];
    var _rsvpMode_extraInitializers = [];
    var _rsvpCompanions_decorators;
    var _rsvpCompanions_initializers = [];
    var _rsvpCompanions_extraInitializers = [];
    var _coverImageUrl_decorators;
    var _coverImageUrl_initializers = [];
    var _coverImageUrl_extraInitializers = [];
    var _coverStyle_decorators;
    var _coverStyle_initializers = [];
    var _coverStyle_extraInitializers = [];
    var _coverSize_decorators;
    var _coverSize_initializers = [];
    var _coverSize_extraInitializers = [];
    var _coverWidthPct_decorators;
    var _coverWidthPct_initializers = [];
    var _coverWidthPct_extraInitializers = [];
    var _galleryItemPct_decorators;
    var _galleryItemPct_initializers = [];
    var _galleryItemPct_extraInitializers = [];
    var _galleryImages_decorators;
    var _galleryImages_initializers = [];
    var _galleryImages_extraInitializers = [];
    var _religiousEnabled_decorators;
    var _religiousEnabled_initializers = [];
    var _religiousEnabled_extraInitializers = [];
    var _religiousTitle_decorators;
    var _religiousTitle_initializers = [];
    var _religiousTitle_extraInitializers = [];
    var _religiousSameLocation_decorators;
    var _religiousSameLocation_initializers = [];
    var _religiousSameLocation_extraInitializers = [];
    var _religiousTime_decorators;
    var _religiousTime_initializers = [];
    var _religiousTime_extraInitializers = [];
    var _religiousLocationName_decorators;
    var _religiousLocationName_initializers = [];
    var _religiousLocationName_extraInitializers = [];
    var _religiousMapsUrl_decorators;
    var _religiousMapsUrl_initializers = [];
    var _religiousMapsUrl_extraInitializers = [];
    var _galleryMosaic_decorators;
    var _galleryMosaic_initializers = [];
    var _galleryMosaic_extraInitializers = [];
    var _dressCode_decorators;
    var _dressCode_initializers = [];
    var _dressCode_extraInitializers = [];
    var _dressCodeNote_decorators;
    var _dressCodeNote_initializers = [];
    var _dressCodeNote_extraInitializers = [];
    var _dressCodeImages_decorators;
    var _dressCodeImages_initializers = [];
    var _dressCodeImages_extraInitializers = [];
    var _giftInfo_decorators;
    var _giftInfo_initializers = [];
    var _giftInfo_extraInitializers = [];
    var _musicUrl_decorators;
    var _musicUrl_initializers = [];
    var _musicUrl_extraInitializers = [];
    var _sectionImages_decorators;
    var _sectionImages_initializers = [];
    var _sectionImages_extraInitializers = [];
    return _a = /** @class */ (function () {
            function EventDataDto() {
                this.coupleOrHonoree = __runInitializers(this, _coupleOrHonoree_initializers, void 0); // nombres (pareja/festejado)
                this.message = (__runInitializers(this, _coupleOrHonoree_extraInitializers), __runInitializers(this, _message_initializers, void 0));
                this.date = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _date_initializers, void 0)); // ISO (YYYY-MM-DD)
                this.time = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _time_initializers, void 0)); // HH:mm (hora de inicio)
                this.endTime = (__runInitializers(this, _time_extraInitializers), __runInitializers(this, _endTime_initializers, void 0)); // HH:mm (hora de finalización, opcional)
                this.timezone = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _timezone_initializers, void 0));
                this.locationName = (__runInitializers(this, _timezone_extraInitializers), __runInitializers(this, _locationName_initializers, void 0));
                // Enlace de Google Maps del lugar del evento (opcional).
                this.mapsUrl = (__runInitializers(this, _locationName_extraInitializers), __runInitializers(this, _mapsUrl_initializers, void 0));
                // Mostrar cuenta regresiva al evento en la invitación (opcional).
                this.showCountdown = (__runInitializers(this, _mapsUrl_extraInitializers), __runInitializers(this, _showCountdown_initializers, void 0));
                // Modo de confirmación en el enlace público: 'abierto' (el invitado elige cuántos)
                // o 'cerrado' (confirma con un número fijo de acompañantes definido por el organizador).
                this.rsvpMode = (__runInitializers(this, _showCountdown_extraInitializers), __runInitializers(this, _rsvpMode_initializers, void 0));
                // Número de acompañantes (adicionales al invitado) en el modo 'cerrado'.
                this.rsvpCompanions = (__runInitializers(this, _rsvpMode_extraInitializers), __runInitializers(this, _rsvpCompanions_initializers, void 0));
                // Imagen de portada de la invitación (URL o ruta /uploads/...). Opcional.
                this.coverImageUrl = (__runInitializers(this, _rsvpCompanions_extraInitializers), __runInitializers(this, _coverImageUrl_initializers, void 0));
                // Estilo de la portada: 'banner' (arriba), 'fondo' (cubre todo) o 'marco' (retrato).
                this.coverStyle = (__runInitializers(this, _coverImageUrl_extraInitializers), __runInitializers(this, _coverStyle_initializers, void 0));
                // Tamaño de la portada (banner/marco): 's' | 'm' | 'l'. (Compatibilidad; ahora se usa coverWidthPct.)
                this.coverSize = (__runInitializers(this, _coverStyle_extraInitializers), __runInitializers(this, _coverSize_initializers, void 0));
                // Ancho de la portada como porcentaje del contenedor (40–100). Control fino con deslizador.
                this.coverWidthPct = (__runInitializers(this, _coverSize_extraInitializers), __runInitializers(this, _coverWidthPct_initializers, void 0));
                // Tamaño de las fotos de la galería como porcentaje de ancho por foto (20–100).
                this.galleryItemPct = (__runInitializers(this, _coverWidthPct_extraInitializers), __runInitializers(this, _galleryItemPct_initializers, void 0));
                // Galería de fotos (URLs o rutas /uploads/...). Máximo 12. Opcional.
                this.galleryImages = (__runInitializers(this, _galleryItemPct_extraInitializers), __runInitializers(this, _galleryImages_initializers, void 0));
                // --- Evento religioso (misa), opcional ---
                // Indica si la invitación incluye un evento religioso.
                this.religiousEnabled = (__runInitializers(this, _galleryImages_extraInitializers), __runInitializers(this, _religiousEnabled_initializers, void 0));
                // Título personalizable de la sección religiosa (ej. "Misa", "Ceremonia").
                // Si está vacío, se usa "Evento religioso".
                this.religiousTitle = (__runInitializers(this, _religiousEnabled_extraInitializers), __runInitializers(this, _religiousTitle_initializers, void 0));
                // Si el evento religioso se celebra en el mismo lugar que el evento principal.
                this.religiousSameLocation = (__runInitializers(this, _religiousTitle_extraInitializers), __runInitializers(this, _religiousSameLocation_initializers, void 0));
                // Hora del evento religioso (HH:mm).
                this.religiousTime = (__runInitializers(this, _religiousSameLocation_extraInitializers), __runInitializers(this, _religiousTime_initializers, void 0));
                // Nombre del lugar del evento religioso (ej. parroquia).
                this.religiousLocationName = (__runInitializers(this, _religiousTime_extraInitializers), __runInitializers(this, _religiousLocationName_initializers, void 0));
                // Enlace de Google Maps del evento religioso (cuando es en otro lugar).
                this.religiousMapsUrl = (__runInitializers(this, _religiousLocationName_extraInitializers), __runInitializers(this, _religiousMapsUrl_initializers, void 0));
                // --- Galería en mosaico ---
                // Si la galería se muestra en estilo mosaico (masonry) en vez de cuadrícula uniforme.
                this.galleryMosaic = (__runInitializers(this, _religiousMapsUrl_extraInitializers), __runInitializers(this, _galleryMosaic_initializers, void 0));
                // --- Código de vestimenta (opcional) ---
                this.dressCode = (__runInitializers(this, _galleryMosaic_extraInitializers), __runInitializers(this, _dressCode_initializers, void 0));
                this.dressCodeNote = (__runInitializers(this, _dressCode_extraInitializers), __runInitializers(this, _dressCodeNote_initializers, void 0));
                // Imágenes de ejemplo del código de vestimenta (URLs o /uploads/...). Máx 6.
                this.dressCodeImages = (__runInitializers(this, _dressCodeNote_extraInitializers), __runInitializers(this, _dressCodeImages_initializers, void 0));
                // --- Mesa de regalos (texto libre: mesas, transferencia, sobres) ---
                this.giftInfo = (__runInitializers(this, _dressCodeImages_extraInitializers), __runInitializers(this, _giftInfo_initializers, void 0));
                // --- Música de fondo (enlace de YouTube) ---
                this.musicUrl = (__runInitializers(this, _giftInfo_extraInitializers), __runInitializers(this, _musicUrl_initializers, void 0));
                // --- Imágenes decorativas intercaladas entre secciones (URLs o /uploads/...). Máx 6. ---
                this.sectionImages = (__runInitializers(this, _musicUrl_extraInitializers), __runInitializers(this, _sectionImages_initializers, void 0));
                __runInitializers(this, _sectionImages_extraInitializers);
            }
            return EventDataDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _coupleOrHonoree_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(120)];
            _message_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _date_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _time_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _endTime_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(10)];
            _timezone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(80)];
            _locationName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _mapsUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(600)];
            _showCountdown_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _rsvpMode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(10)];
            _rsvpCompanions_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(20)];
            _coverImageUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(600)];
            _coverStyle_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(20)];
            _coverSize_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(5)];
            _coverWidthPct_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(30), (0, class_validator_1.Max)(100)];
            _galleryItemPct_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(20), (0, class_validator_1.Max)(100)];
            _galleryImages_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMaxSize)(12), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.MaxLength)(600, { each: true })];
            _religiousEnabled_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _religiousTitle_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(60)];
            _religiousSameLocation_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _religiousTime_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(10)];
            _religiousLocationName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _religiousMapsUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(600)];
            _galleryMosaic_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _dressCode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(120)];
            _dressCodeNote_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(300)];
            _dressCodeImages_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMaxSize)(6), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.MaxLength)(600, { each: true })];
            _giftInfo_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1500)];
            _musicUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(600)];
            _sectionImages_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMaxSize)(6), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.MaxLength)(600, { each: true })];
            __esDecorate(null, null, _coupleOrHonoree_decorators, { kind: "field", name: "coupleOrHonoree", static: false, private: false, access: { has: function (obj) { return "coupleOrHonoree" in obj; }, get: function (obj) { return obj.coupleOrHonoree; }, set: function (obj, value) { obj.coupleOrHonoree = value; } }, metadata: _metadata }, _coupleOrHonoree_initializers, _coupleOrHonoree_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: function (obj) { return "message" in obj; }, get: function (obj) { return obj.message; }, set: function (obj, value) { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _time_decorators, { kind: "field", name: "time", static: false, private: false, access: { has: function (obj) { return "time" in obj; }, get: function (obj) { return obj.time; }, set: function (obj, value) { obj.time = value; } }, metadata: _metadata }, _time_initializers, _time_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: function (obj) { return "endTime" in obj; }, get: function (obj) { return obj.endTime; }, set: function (obj, value) { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            __esDecorate(null, null, _timezone_decorators, { kind: "field", name: "timezone", static: false, private: false, access: { has: function (obj) { return "timezone" in obj; }, get: function (obj) { return obj.timezone; }, set: function (obj, value) { obj.timezone = value; } }, metadata: _metadata }, _timezone_initializers, _timezone_extraInitializers);
            __esDecorate(null, null, _locationName_decorators, { kind: "field", name: "locationName", static: false, private: false, access: { has: function (obj) { return "locationName" in obj; }, get: function (obj) { return obj.locationName; }, set: function (obj, value) { obj.locationName = value; } }, metadata: _metadata }, _locationName_initializers, _locationName_extraInitializers);
            __esDecorate(null, null, _mapsUrl_decorators, { kind: "field", name: "mapsUrl", static: false, private: false, access: { has: function (obj) { return "mapsUrl" in obj; }, get: function (obj) { return obj.mapsUrl; }, set: function (obj, value) { obj.mapsUrl = value; } }, metadata: _metadata }, _mapsUrl_initializers, _mapsUrl_extraInitializers);
            __esDecorate(null, null, _showCountdown_decorators, { kind: "field", name: "showCountdown", static: false, private: false, access: { has: function (obj) { return "showCountdown" in obj; }, get: function (obj) { return obj.showCountdown; }, set: function (obj, value) { obj.showCountdown = value; } }, metadata: _metadata }, _showCountdown_initializers, _showCountdown_extraInitializers);
            __esDecorate(null, null, _rsvpMode_decorators, { kind: "field", name: "rsvpMode", static: false, private: false, access: { has: function (obj) { return "rsvpMode" in obj; }, get: function (obj) { return obj.rsvpMode; }, set: function (obj, value) { obj.rsvpMode = value; } }, metadata: _metadata }, _rsvpMode_initializers, _rsvpMode_extraInitializers);
            __esDecorate(null, null, _rsvpCompanions_decorators, { kind: "field", name: "rsvpCompanions", static: false, private: false, access: { has: function (obj) { return "rsvpCompanions" in obj; }, get: function (obj) { return obj.rsvpCompanions; }, set: function (obj, value) { obj.rsvpCompanions = value; } }, metadata: _metadata }, _rsvpCompanions_initializers, _rsvpCompanions_extraInitializers);
            __esDecorate(null, null, _coverImageUrl_decorators, { kind: "field", name: "coverImageUrl", static: false, private: false, access: { has: function (obj) { return "coverImageUrl" in obj; }, get: function (obj) { return obj.coverImageUrl; }, set: function (obj, value) { obj.coverImageUrl = value; } }, metadata: _metadata }, _coverImageUrl_initializers, _coverImageUrl_extraInitializers);
            __esDecorate(null, null, _coverStyle_decorators, { kind: "field", name: "coverStyle", static: false, private: false, access: { has: function (obj) { return "coverStyle" in obj; }, get: function (obj) { return obj.coverStyle; }, set: function (obj, value) { obj.coverStyle = value; } }, metadata: _metadata }, _coverStyle_initializers, _coverStyle_extraInitializers);
            __esDecorate(null, null, _coverSize_decorators, { kind: "field", name: "coverSize", static: false, private: false, access: { has: function (obj) { return "coverSize" in obj; }, get: function (obj) { return obj.coverSize; }, set: function (obj, value) { obj.coverSize = value; } }, metadata: _metadata }, _coverSize_initializers, _coverSize_extraInitializers);
            __esDecorate(null, null, _coverWidthPct_decorators, { kind: "field", name: "coverWidthPct", static: false, private: false, access: { has: function (obj) { return "coverWidthPct" in obj; }, get: function (obj) { return obj.coverWidthPct; }, set: function (obj, value) { obj.coverWidthPct = value; } }, metadata: _metadata }, _coverWidthPct_initializers, _coverWidthPct_extraInitializers);
            __esDecorate(null, null, _galleryItemPct_decorators, { kind: "field", name: "galleryItemPct", static: false, private: false, access: { has: function (obj) { return "galleryItemPct" in obj; }, get: function (obj) { return obj.galleryItemPct; }, set: function (obj, value) { obj.galleryItemPct = value; } }, metadata: _metadata }, _galleryItemPct_initializers, _galleryItemPct_extraInitializers);
            __esDecorate(null, null, _galleryImages_decorators, { kind: "field", name: "galleryImages", static: false, private: false, access: { has: function (obj) { return "galleryImages" in obj; }, get: function (obj) { return obj.galleryImages; }, set: function (obj, value) { obj.galleryImages = value; } }, metadata: _metadata }, _galleryImages_initializers, _galleryImages_extraInitializers);
            __esDecorate(null, null, _religiousEnabled_decorators, { kind: "field", name: "religiousEnabled", static: false, private: false, access: { has: function (obj) { return "religiousEnabled" in obj; }, get: function (obj) { return obj.religiousEnabled; }, set: function (obj, value) { obj.religiousEnabled = value; } }, metadata: _metadata }, _religiousEnabled_initializers, _religiousEnabled_extraInitializers);
            __esDecorate(null, null, _religiousTitle_decorators, { kind: "field", name: "religiousTitle", static: false, private: false, access: { has: function (obj) { return "religiousTitle" in obj; }, get: function (obj) { return obj.religiousTitle; }, set: function (obj, value) { obj.religiousTitle = value; } }, metadata: _metadata }, _religiousTitle_initializers, _religiousTitle_extraInitializers);
            __esDecorate(null, null, _religiousSameLocation_decorators, { kind: "field", name: "religiousSameLocation", static: false, private: false, access: { has: function (obj) { return "religiousSameLocation" in obj; }, get: function (obj) { return obj.religiousSameLocation; }, set: function (obj, value) { obj.religiousSameLocation = value; } }, metadata: _metadata }, _religiousSameLocation_initializers, _religiousSameLocation_extraInitializers);
            __esDecorate(null, null, _religiousTime_decorators, { kind: "field", name: "religiousTime", static: false, private: false, access: { has: function (obj) { return "religiousTime" in obj; }, get: function (obj) { return obj.religiousTime; }, set: function (obj, value) { obj.religiousTime = value; } }, metadata: _metadata }, _religiousTime_initializers, _religiousTime_extraInitializers);
            __esDecorate(null, null, _religiousLocationName_decorators, { kind: "field", name: "religiousLocationName", static: false, private: false, access: { has: function (obj) { return "religiousLocationName" in obj; }, get: function (obj) { return obj.religiousLocationName; }, set: function (obj, value) { obj.religiousLocationName = value; } }, metadata: _metadata }, _religiousLocationName_initializers, _religiousLocationName_extraInitializers);
            __esDecorate(null, null, _religiousMapsUrl_decorators, { kind: "field", name: "religiousMapsUrl", static: false, private: false, access: { has: function (obj) { return "religiousMapsUrl" in obj; }, get: function (obj) { return obj.religiousMapsUrl; }, set: function (obj, value) { obj.religiousMapsUrl = value; } }, metadata: _metadata }, _religiousMapsUrl_initializers, _religiousMapsUrl_extraInitializers);
            __esDecorate(null, null, _galleryMosaic_decorators, { kind: "field", name: "galleryMosaic", static: false, private: false, access: { has: function (obj) { return "galleryMosaic" in obj; }, get: function (obj) { return obj.galleryMosaic; }, set: function (obj, value) { obj.galleryMosaic = value; } }, metadata: _metadata }, _galleryMosaic_initializers, _galleryMosaic_extraInitializers);
            __esDecorate(null, null, _dressCode_decorators, { kind: "field", name: "dressCode", static: false, private: false, access: { has: function (obj) { return "dressCode" in obj; }, get: function (obj) { return obj.dressCode; }, set: function (obj, value) { obj.dressCode = value; } }, metadata: _metadata }, _dressCode_initializers, _dressCode_extraInitializers);
            __esDecorate(null, null, _dressCodeNote_decorators, { kind: "field", name: "dressCodeNote", static: false, private: false, access: { has: function (obj) { return "dressCodeNote" in obj; }, get: function (obj) { return obj.dressCodeNote; }, set: function (obj, value) { obj.dressCodeNote = value; } }, metadata: _metadata }, _dressCodeNote_initializers, _dressCodeNote_extraInitializers);
            __esDecorate(null, null, _dressCodeImages_decorators, { kind: "field", name: "dressCodeImages", static: false, private: false, access: { has: function (obj) { return "dressCodeImages" in obj; }, get: function (obj) { return obj.dressCodeImages; }, set: function (obj, value) { obj.dressCodeImages = value; } }, metadata: _metadata }, _dressCodeImages_initializers, _dressCodeImages_extraInitializers);
            __esDecorate(null, null, _giftInfo_decorators, { kind: "field", name: "giftInfo", static: false, private: false, access: { has: function (obj) { return "giftInfo" in obj; }, get: function (obj) { return obj.giftInfo; }, set: function (obj, value) { obj.giftInfo = value; } }, metadata: _metadata }, _giftInfo_initializers, _giftInfo_extraInitializers);
            __esDecorate(null, null, _musicUrl_decorators, { kind: "field", name: "musicUrl", static: false, private: false, access: { has: function (obj) { return "musicUrl" in obj; }, get: function (obj) { return obj.musicUrl; }, set: function (obj, value) { obj.musicUrl = value; } }, metadata: _metadata }, _musicUrl_initializers, _musicUrl_extraInitializers);
            __esDecorate(null, null, _sectionImages_decorators, { kind: "field", name: "sectionImages", static: false, private: false, access: { has: function (obj) { return "sectionImages" in obj; }, get: function (obj) { return obj.sectionImages; }, set: function (obj, value) { obj.sectionImages = value; } }, metadata: _metadata }, _sectionImages_initializers, _sectionImages_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.EventDataDto = EventDataDto;
// Actualización del borrador: título, contenido del evento y personalización del diseño.
var UpdateInvitationDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _eventData_decorators;
    var _eventData_initializers = [];
    var _eventData_extraInitializers = [];
    var _customization_decorators;
    var _customization_initializers = [];
    var _customization_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateInvitationDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.eventData = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _eventData_initializers, void 0));
                // Personalización del diseño (colores, tipografías). Objeto flexible.
                this.customization = (__runInitializers(this, _eventData_extraInitializers), __runInitializers(this, _customization_initializers, void 0));
                __runInitializers(this, _customization_extraInitializers);
            }
            return UpdateInvitationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(160)];
            _eventData_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return EventDataDto; })];
            _customization_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _eventData_decorators, { kind: "field", name: "eventData", static: false, private: false, access: { has: function (obj) { return "eventData" in obj; }, get: function (obj) { return obj.eventData; }, set: function (obj, value) { obj.eventData = value; } }, metadata: _metadata }, _eventData_initializers, _eventData_extraInitializers);
            __esDecorate(null, null, _customization_decorators, { kind: "field", name: "customization", static: false, private: false, access: { has: function (obj) { return "customization" in obj; }, get: function (obj) { return obj.customization; }, set: function (obj, value) { obj.customization = value; } }, metadata: _metadata }, _customization_initializers, _customization_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateInvitationDto = UpdateInvitationDto;
