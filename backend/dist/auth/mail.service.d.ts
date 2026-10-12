import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly logger;
    private readonly transporter;
    private readonly from;
    constructor(config: ConfigService);
    get isEnabled(): boolean;
    sendPasswordReset(to: string, resetUrl: string): Promise<void>;
}
