"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
const PDF_SIZES = {
    A5: 'A5',
    A6: 'A6',
    LETTER: 'LETTER',
};
let PdfService = class PdfService {
    resolveSize(input) {
        const up = (input ?? '').toUpperCase();
        return up === 'A6' || up === 'LETTER' ? up : 'A5';
    }
    async buildInvitationPdf(invitation, size = 'A5') {
        const c = (invitation.customization ?? {});
        const d = (invitation.event?.data ?? {});
        const primary = c.primary || '#b8860b';
        const secondary = c.secondary || '#7a5c13';
        const background = c.background || '#fbf7ef';
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: PDF_SIZES[size], margin: 0 });
            const chunks = [];
            doc.on('data', (ch) => chunks.push(ch));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            const w = doc.page.width;
            const h = doc.page.height;
            const k = w / 420;
            doc.rect(0, 0, w, h).fill(background);
            doc.rect(0, 0, w, h * 0.04).fill(primary);
            doc.rect(0, h - h * 0.04, w, h * 0.04).fill(primary);
            const inset = 24 * k;
            doc
                .lineWidth(1.5 * k)
                .strokeColor(primary)
                .rect(inset, inset, w - inset * 2, h - inset * 2)
                .stroke();
            const cx = w / 2;
            let y = h * 0.18;
            doc.fillColor(secondary).font('Helvetica').fontSize(11 * k);
            doc.text('TE INVITAMOS A', 0, y, { align: 'center', characterSpacing: 3 });
            y += 34 * k;
            doc.fillColor(primary).font('Times-Bold').fontSize(26 * k);
            doc.text(invitation.event?.title || 'Nuestro evento', inset, y, {
                align: 'center',
                width: w - inset * 2,
            });
            y += 48 * k;
            if (d.coupleOrHonoree) {
                doc.fillColor(secondary).font('Times-Italic').fontSize(17 * k);
                doc.text(d.coupleOrHonoree, inset, y, { align: 'center', width: w - inset * 2 });
                y += 34 * k;
            }
            doc
                .lineWidth(1 * k)
                .strokeColor(primary)
                .moveTo(cx - 40 * k, y)
                .lineTo(cx + 40 * k, y)
                .stroke();
            y += 24 * k;
            doc.fillColor(secondary).font('Helvetica').fontSize(12.5 * k);
            const when = [d.date, d.time ? `${d.time} h` : ''].filter(Boolean).join('  ·  ');
            if (when) {
                doc.text(when, inset, y, { align: 'center', width: w - inset * 2 });
                y += 24 * k;
            }
            if (d.locationName) {
                doc.text(d.locationName, inset, y, { align: 'center', width: w - inset * 2 });
                y += 24 * k;
            }
            if (d.message) {
                doc.font('Times-Italic').fontSize(11.5 * k);
                doc.text(d.message, inset + 16 * k, y + 8 * k, {
                    align: 'center',
                    width: w - inset * 2 - 32 * k,
                });
            }
            doc.end();
        });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map