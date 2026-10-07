import { Invitation } from './invitation.entity';
export type PdfSize = 'A5' | 'A6' | 'LETTER';
export declare class PdfService {
    resolveSize(input?: string): PdfSize;
    buildInvitationPdf(invitation: Invitation, size?: PdfSize): Promise<Buffer>;
}
