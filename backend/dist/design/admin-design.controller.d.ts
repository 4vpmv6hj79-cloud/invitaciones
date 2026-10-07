import { DesignService } from './design.service';
import { DesignStatus } from './design-request.entity';
import { PostMessageDto } from './dto/post-message.dto';
import { UserRole } from '../auth/user.entity';
type AuthUser = {
    id: string;
    role: UserRole;
};
export declare class AdminDesignController {
    private readonly service;
    constructor(service: DesignService);
    list(status?: DesignStatus): Promise<import("./design-request.entity").DesignRequest[]>;
    getThread(id: string, user: AuthUser): Promise<import("./design.service").RequestWithThread>;
    listReferences(id: string, user: AuthUser): Promise<import("./design-reference.entity").DesignReference[]>;
    setStatus(id: string, status: DesignStatus): Promise<import("./design-request.entity").DesignRequest>;
    addProposal(id: string, dto: PostMessageDto, priceCents: number, user: AuthUser): Promise<import("./design-message.entity").DesignMessage>;
}
export {};
