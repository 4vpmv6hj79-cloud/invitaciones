import { Repository } from 'typeorm';
import { DesignRequest, DesignStatus } from './design-request.entity';
import { DesignMessage } from './design-message.entity';
import { DesignReference } from './design-reference.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { PostMessageDto } from './dto/post-message.dto';
export interface RequestWithThread {
    request: DesignRequest;
    messages: DesignMessage[];
}
export declare class DesignService {
    private readonly requests;
    private readonly messages;
    private readonly references;
    private readonly MAX_REFERENCES;
    constructor(requests: Repository<DesignRequest>, messages: Repository<DesignMessage>, references: Repository<DesignReference>);
    private assertAccess;
    addReference(id: string, user: {
        id: string;
        role: string;
    }, filename: string): Promise<DesignReference>;
    listReferences(id: string, user: {
        id: string;
        role: string;
    }): Promise<DesignReference[]>;
    removeReference(id: string, refId: string, user: {
        id: string;
        role: string;
    }): Promise<void>;
    private safeUnlink;
    createRequest(requesterId: string, dto: CreateRequestDto): Promise<DesignRequest>;
    listMine(requesterId: string): Promise<DesignRequest[]>;
    getThread(id: string, user: {
        id: string;
        role: string;
    }): Promise<RequestWithThread>;
    addClientMessage(id: string, userId: string, dto: PostMessageDto): Promise<DesignMessage>;
    getPayable(id: string, userId: string): Promise<DesignRequest>;
    markApprovedPaid(id: string): Promise<DesignRequest>;
    requestAdjustment(id: string, userId: string, note: string): Promise<DesignMessage>;
    listAll(status?: DesignStatus): Promise<DesignRequest[]>;
    setStatus(id: string, status: DesignStatus): Promise<DesignRequest>;
    addProposal(id: string, adminId: string, dto: PostMessageDto, priceCents: number): Promise<DesignMessage>;
}
