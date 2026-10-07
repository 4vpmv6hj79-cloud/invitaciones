import { DesignRequest } from './design-request.entity';
export declare class DesignMessage {
    id: string;
    request: DesignRequest;
    requestId: string;
    authorId: string;
    authorRole: string;
    body: string;
    isProposal: boolean;
    createdAt: Date;
}
