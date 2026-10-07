import { DesignService } from './design.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { PostMessageDto } from './dto/post-message.dto';
import { UserRole } from '../auth/user.entity';
type AuthUser = {
    id: string;
    role: UserRole;
};
export declare class DesignController {
    private readonly service;
    constructor(service: DesignService);
    create(dto: CreateRequestDto, user: AuthUser): Promise<import("./design-request.entity").DesignRequest>;
    listMine(user: AuthUser): Promise<import("./design-request.entity").DesignRequest[]>;
    getThread(id: string, user: AuthUser): Promise<import("./design.service").RequestWithThread>;
    addMessage(id: string, dto: PostMessageDto, user: AuthUser): Promise<import("./design-message.entity").DesignMessage>;
    requestAdjustment(id: string, note: string, user: AuthUser): Promise<import("./design-message.entity").DesignMessage>;
    listReferences(id: string, user: AuthUser): Promise<import("./design-reference.entity").DesignReference[]>;
    uploadReference(id: string, file: Express.Multer.File, user: AuthUser): Promise<import("./design-reference.entity").DesignReference>;
    removeReference(id: string, refId: string, user: AuthUser): Promise<void>;
}
export {};
