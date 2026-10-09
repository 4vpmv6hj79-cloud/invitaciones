import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private readonly logger;
    private readonly configured;
    constructor(config: ConfigService);
    isConfigured(): boolean;
    uploadImage(buffer: Buffer): Promise<string>;
}
