"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECURITY_QUESTIONS = void 0;
exports.isValidQuestionId = isValidQuestionId;
exports.normalizeAnswer = normalizeAnswer;
exports.SECURITY_QUESTIONS = [
    { id: 'pet', text: '¿Cuál fue el nombre de tu primera mascota?' },
    { id: 'city', text: '¿En qué ciudad naciste?' },
    { id: 'school', text: '¿Cuál fue el nombre de tu primera escuela?' },
    { id: 'mother', text: '¿Cuál es el segundo nombre de tu madre?' },
    { id: 'nickname', text: '¿Cuál era tu apodo de la infancia?' },
    { id: 'favoriteTeacher', text: '¿Cómo se llamaba tu maestro(a) favorito(a)?' },
    { id: 'favoriteFood', text: '¿Cuál es tu platillo favorito?' },
];
const VALID_IDS = new Set(exports.SECURITY_QUESTIONS.map((q) => q.id));
function isValidQuestionId(id) {
    return !!id && VALID_IDS.has(id);
}
function normalizeAnswer(answer) {
    return answer
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ');
}
//# sourceMappingURL=security-questions.js.map