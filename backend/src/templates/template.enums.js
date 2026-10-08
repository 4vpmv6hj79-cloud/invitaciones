"use strict";
// Enums compartidos del dominio de plantillas.
// Se mantienen como listas de datos para poder ampliarlos sin reconstruir la plataforma.
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATE_STYLE_LABELS = exports.TEMPLATE_FORMAT_LABELS = exports.EVENT_TYPE_LABELS = exports.TemplateStyle = exports.TemplateFormat = exports.EventType = void 0;
// Tipos de evento soportados. "custom" es el comodín para eventos no listados.
var EventType;
(function (EventType) {
    EventType["Boda"] = "boda";
    EventType["BodaDeOro"] = "boda_de_oro";
    EventType["Aniversario"] = "aniversario";
    EventType["XV"] = "xv";
    EventType["Cumpleanos"] = "cumpleanos";
    EventType["FiestaInfantil"] = "fiesta_infantil";
    EventType["Bautizo"] = "bautizo";
    EventType["PrimeraComunion"] = "primera_comunion";
    EventType["Graduacion"] = "graduacion";
    EventType["BabyShower"] = "baby_shower";
    EventType["Despedida"] = "despedida";
    EventType["Personalizado"] = "personalizado";
})(EventType || (exports.EventType = EventType = {}));
// Formatos de entrega. En el MVP solo web e imagen; pdf y video llegan en fases posteriores.
var TemplateFormat;
(function (TemplateFormat) {
    TemplateFormat["Web"] = "web";
    TemplateFormat["Image"] = "image";
})(TemplateFormat || (exports.TemplateFormat = TemplateFormat = {}));
// Estilos visuales, usados como etiqueta de filtrado (transversales al tipo de evento).
var TemplateStyle;
(function (TemplateStyle) {
    TemplateStyle["Elegante"] = "elegante";
    TemplateStyle["Moderno"] = "moderno";
    TemplateStyle["Infantil"] = "infantil";
    TemplateStyle["Floral"] = "floral";
    TemplateStyle["Corporativo"] = "corporativo";
})(TemplateStyle || (exports.TemplateStyle = TemplateStyle = {}));
// Etiquetas legibles para mostrar en la interfaz (español).
exports.EVENT_TYPE_LABELS = (_a = {},
    _a[EventType.Boda] = 'Boda',
    _a[EventType.BodaDeOro] = 'Boda de oro',
    _a[EventType.Aniversario] = 'Aniversario',
    _a[EventType.XV] = 'XV años',
    _a[EventType.Cumpleanos] = 'Cumpleaños',
    _a[EventType.FiestaInfantil] = 'Fiesta infantil',
    _a[EventType.Bautizo] = 'Bautizo',
    _a[EventType.PrimeraComunion] = 'Primera comunión',
    _a[EventType.Graduacion] = 'Graduación',
    _a[EventType.BabyShower] = 'Baby shower',
    _a[EventType.Despedida] = 'Despedida',
    _a[EventType.Personalizado] = 'Evento personalizado',
    _a);
exports.TEMPLATE_FORMAT_LABELS = (_b = {},
    _b[TemplateFormat.Web] = 'Invitación web',
    _b[TemplateFormat.Image] = 'Imagen para compartir',
    _b);
exports.TEMPLATE_STYLE_LABELS = (_c = {},
    _c[TemplateStyle.Elegante] = 'Elegante',
    _c[TemplateStyle.Moderno] = 'Moderno / minimalista',
    _c[TemplateStyle.Infantil] = 'Infantil',
    _c[TemplateStyle.Floral] = 'Floral / romántico',
    _c[TemplateStyle.Corporativo] = 'Corporativo',
    _c);
