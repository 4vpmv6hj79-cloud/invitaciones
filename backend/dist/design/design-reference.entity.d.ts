import { DesignRequest } from './design-request.entity';
export declare class DesignReference {
    id: string;
    request: DesignRequest;
    requestId: string;
    filename: string;
    url: string;
    createdAt: Date;
}
