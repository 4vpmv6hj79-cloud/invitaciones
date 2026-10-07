import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { InvitationsService } from './invitations.service';
export declare class PublicInvitationController {
    private readonly service;
    private readonly config;
    constructor(service: InvitationsService, config: ConfigService);
    findByToken(token: string): Promise<{
        title: string;
        eventType: string;
        data: Record<string, unknown>;
        customization: Record<string, unknown>;
        expired: boolean;
    }>;
    image(token: string): Promise<string>;
    imagePng(token: string, res: Response): Promise<void>;
    share(token: string, res: Response): Promise<void>;
    private escapeHtml;
}
