"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATE_STYLE_LABELS = exports.TEMPLATE_FORMAT_LABELS = exports.EVENT_TYPE_LABELS = exports.TemplateStyle = exports.TemplateFormat = exports.EventType = void 0;
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
var TemplateFormat;
(function (TemplateFormat) {
    TemplateFormat["Web"] = "web";
    TemplateFormat["Image"] = "image";
})(TemplateFormat || (exports.TemplateFormat = TemplateFormat = {}));
var TemplateStyle;
(function (TemplateStyle) {
    TemplateStyle["Elegante"] = "elegante";
    TemplateStyle["Moderno"] = "moderno";
    TemplateStyle["Infantil"] = "infantil";
    TemplateStyle["Floral"] = "floral";
    TemplateStyle["Corporativo"] = "corporativo";
})(TemplateStyle || (exports.TemplateStyle = TemplateStyle = {}));
exports.EVENT_TYPE_LABELS = {
    [EventType.Boda]: 'Boda',
    [EventType.BodaDeOro]: 'Boda de oro',
    [EventType.Aniversario]: 'Aniversario',
    [EventType.XV]: 'XV años',
    [EventType.Cumpleanos]: 'Cumpleaños',
    [EventType.FiestaInfantil]: 'Fiesta infantil',
    [EventType.Bautizo]: 'Bautizo',
    [EventType.PrimeraComunion]: 'Primera comunión',
    [EventType.Graduacion]: 'Graduación',
    [EventType.BabyShower]: 'Baby shower',
    [EventType.Despedida]: 'Despedida',
    [EventType.Personalizado]: 'Evento personalizado',
};
exports.TEMPLATE_FORMAT_LABELS = {
    [TemplateFormat.Web]: 'Invitación web',
    [TemplateFormat.Image]: 'Imagen para compartir',
};
exports.TEMPLATE_STYLE_LABELS = {
    [TemplateStyle.Elegante]: 'Elegante',
    [TemplateStyle.Moderno]: 'Moderno / minimalista',
    [TemplateStyle.Infantil]: 'Infantil',
    [TemplateStyle.Floral]: 'Floral / romántico',
    [TemplateStyle.Corporativo]: 'Corporativo',
};
//# sourceMappingURL=template.enums.js.map