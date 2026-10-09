import { Response } from 'express';
import { InvitationsService } from './invitations.service';
import { PdfService } from './pdf.service';
import { CloudinaryService } from './cloudinary.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
export declare class InvitationsController {
    private readonly service;
    private readonly pdf;
    private readonly cloudinary;
    constructor(service: InvitationsService, pdf: PdfService, cloudinary: CloudinaryService);
    create(dto: CreateInvitationDto, user: {
        id: string;
    }): Promise<import("./invitation.entity").Invitation>;
    listMine(user: {
        id: string;
    }): Promise<import("./invitation.entity").Invitation[]>;
    findOne(id: string, user: {
        id: string;
    }): Promise<import("./invitation.entity").Invitation>;
    downloadPdf(id: string, user: {
        id: string;
    }, res: Response, size?: string): Promise<void>;
    update(id: string, dto: UpdateInvitationDto, user: {
        id: string;
    }): Promise<import("./invitation.entity").Invitation>;
    uploadImage(id: string, file: Express.Multer.File, user: {
        id: string;
    }): Promise<{
        url: string;
    }>;
}
