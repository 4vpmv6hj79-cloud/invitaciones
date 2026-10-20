"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLANS = void 0;
exports.getPlan = getPlan;
exports.isValidPlan = isValidPlan;
exports.PLANS = {
    esencial: {
        id: 'esencial',
        name: 'Esencial',
        priceCents: 69900,
        features: [
            'cover',
            'countdown',
            'location',
            'dressCode',
            'gift',
            'gallery',
            'rsvp',
        ],
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        priceCents: 129900,
        features: [
            'cover',
            'countdown',
            'location',
            'dressCode',
            'gift',
            'gallery',
            'rsvp',
            'music',
            'guestPasses',
            'religious',
            'parents',
            'lodging',
            'recommendations',
            'weather',
            'sectionImages',
        ],
    },
    platinum: {
        id: 'platinum',
        name: 'Platinum QR',
        priceCents: 189900,
        features: [
            'cover',
            'countdown',
            'location',
            'dressCode',
            'gift',
            'gallery',
            'rsvp',
            'music',
            'guestPasses',
            'religious',
            'parents',
            'lodging',
            'recommendations',
            'weather',
            'sectionImages',
            'ticketsQr',
        ],
    },
};
function getPlan(id) {
    if (id && (id === 'esencial' || id === 'premium' || id === 'platinum')) {
        return exports.PLANS[id];
    }
    return exports.PLANS.premium;
}
function isValidPlan(id) {
    return id === 'esencial' || id === 'premium' || id === 'platinum';
}
//# sourceMappingURL=plans.js.map