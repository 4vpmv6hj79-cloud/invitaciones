import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Invitation } from './invitation.entity';

// Tamaños de PDF soportados.
export type PdfSize = 'A5' | 'A6' | 'LETTER';

const PDF_SIZES: Record<PdfSize, string> = {
  A5: 'A5',
  A6: 'A6',
  LETTER: 'LETTER',
};

@Injectable()
export class PdfService {
  // Normaliza el parámetro de tamaño (default A5).
  resolveSize(input?: string): PdfSize {
    const up = (input ?? '').toUpperCase();
    return up === 'A6' || up === 'LETTER' ? (up as PdfSize) : 'A5';
  }

  // Genera el PDF de la invitación como Buffer, listo para imprimir.
  // Las posiciones se calculan en proporción al tamaño de página elegido.
  // Usa solo fuentes integradas de PDFKit (sin recursos con licencia de pago).
  async buildInvitationPdf(invitation: Invitation, size: PdfSize = 'A5'): Promise<Buffer> {
    const c = (invitation.customization ?? {}) as Record<string, string>;
    const d = (invitation.event?.data ?? {}) as Record<string, string>;

    const primary = c.primary || '#b8860b';
    const secondary = c.secondary || '#7a5c13';
    const background = c.background || '#fbf7ef';

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: PDF_SIZES[size], margin: 0 });
      const chunks: Buffer[] = [];
      doc.on('data', (ch) => chunks.push(ch));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const w = doc.page.width;
      const h = doc.page.height;
      // Escala tipográfica relativa al ancho (A5 ~ 420pt de referencia).
      const k = w / 420;

      // Fondo a sangre completa.
      doc.rect(0, 0, w, h).fill(background);

      // Bandas decorativas superior e inferior con el color principal.
      doc.rect(0, 0, w, h * 0.04).fill(primary);
      doc.rect(0, h - h * 0.04, w, h * 0.04).fill(primary);

      // Marco interior.
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

      // Separador.
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
}
