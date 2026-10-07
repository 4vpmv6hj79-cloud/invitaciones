"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const QRCode = __importStar(require("qrcode"));
const guest_entity_1 = require("../guests/guest.entity");
const invitation_entity_1 = require("../invitations/invitation.entity");
const access_assignment_entity_1 = require("./access-assignment.entity");
const user_entity_1 = require("../auth/user.entity");
let TicketsService = class TicketsService {
    constructor(guests, invitations, assignments, users, config) {
        this.guests = guests;
        this.invitations = invitations;
        this.assignments = assignments;
        this.users = users;
        this.config = config;
    }
    async assertOwner(invitationId, userId) {
        const invitation = await this.invitations.findOne({ where: { id: invitationId } });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitación no encontrada');
        }
        if (invitation.ownerId && invitation.ownerId !== userId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta invitación');
        }
        return invitation;
    }
    async assertCanValidate(invitationId, user) {
        const invitation = await this.invitations.findOne({ where: { id: invitationId } });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitación no encontrada');
        }
        if (invitation.ownerId === user.id) {
            return;
        }
        const assigned = await this.assignments.findOne({
            where: { invitationId, userId: user.id },
        });
        if (!assigned) {
            throw new common_1.ForbiddenException('No estás autorizado para validar en este evento');
        }
    }
    async setTicketsEnabled(invitationId, userId, enabled) {
        const invitation = await this.assertOwner(invitationId, userId);
        invitation.ticketsEnabled = enabled;
        await this.invitations.save(invitation);
        let issued = 0;
        if (enabled) {
            const confirmed = await this.guests.find({
                where: { invitationId, rsvpStatus: guest_entity_1.RsvpStatus.Confirmed },
            });
            for (const g of confirmed) {
                if (!g.ticketToken) {
                    g.ticketToken = (0, crypto_1.randomBytes)(18).toString('hex');
                    await this.guests.save(g);
                    issued += 1;
                }
            }
        }
        return { ticketsEnabled: enabled, issued };
    }
    async getGuestPass(accessToken) {
        const guest = await this.guests.findOne({ where: { accessToken } });
        if (!guest) {
            throw new common_1.NotFoundException('Invitación no encontrada');
        }
        const invitation = await this.invitations.findOne({ where: { id: guest.invitationId } });
        if (!invitation?.ticketsEnabled) {
            return { hasPass: false, reason: 'tickets_disabled' };
        }
        if (guest.rsvpStatus !== guest_entity_1.RsvpStatus.Confirmed) {
            return { hasPass: false, reason: 'not_confirmed' };
        }
        if (!guest.ticketToken) {
            guest.ticketToken = (0, crypto_1.randomBytes)(18).toString('hex');
            await this.guests.save(guest);
        }
        const frontendUrl = this.config.get('FRONTEND_URL') ?? 'http://localhost:4300';
        const validateUrl = `${frontendUrl}/validar/${guest.ticketToken}`;
        const qrDataUrl = await QRCode.toDataURL(validateUrl, { margin: 1, width: 240 });
        return {
            hasPass: true,
            guestName: guest.name,
            seats: guest.confirmedSeats,
            qrDataUrl,
        };
    }
    async inspect(ticketToken, user) {
        const guest = await this.guests.findOne({ where: { ticketToken } });
        if (!guest) {
            throw new common_1.NotFoundException('Pase no encontrado');
        }
        await this.assertCanValidate(guest.invitationId, user);
        return this.toResult(guest);
    }
    async checkIn(ticketToken, user) {
        const guest = await this.guests.findOne({ where: { ticketToken } });
        if (!guest) {
            throw new common_1.NotFoundException('Pase no encontrado');
        }
        await this.assertCanValidate(guest.invitationId, user);
        if (guest.rsvpStatus !== guest_entity_1.RsvpStatus.Confirmed) {
            throw new common_1.BadRequestException('El invitado no confirmó asistencia');
        }
        if (guest.checkedInAt) {
            return this.toResult(guest);
        }
        guest.checkedInAt = new Date();
        await this.guests.save(guest);
        return {
            state: 'valid',
            guestName: guest.name,
            confirmedSeats: guest.confirmedSeats,
            checkedInAt: guest.checkedInAt.toISOString(),
        };
    }
    async assignStaff(invitationId, ownerId, email) {
        await this.assertOwner(invitationId, ownerId);
        const user = await this.users.findOne({ where: { email: email.toLowerCase().trim() } });
        if (!user) {
            throw new common_1.NotFoundException('No existe un usuario con ese correo');
        }
        if (user.role === user_entity_1.UserRole.Organizer) {
            user.role = user_entity_1.UserRole.Staff;
            await this.users.save(user);
        }
        const existing = await this.assignments.findOne({
            where: { invitationId, userId: user.id },
        });
        if (existing) {
            return existing;
        }
        return this.assignments.save(this.assignments.create({ invitationId, userId: user.id }));
    }
    toResult(guest) {
        const state = guest.rsvpStatus !== guest_entity_1.RsvpStatus.Confirmed
            ? 'not_confirmed'
            : guest.checkedInAt
                ? 'already_used'
                : 'valid';
        return {
            state,
            guestName: guest.name,
            confirmedSeats: guest.confirmedSeats,
            checkedInAt: guest.checkedInAt ? guest.checkedInAt.toISOString() : null,
        };
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(guest_entity_1.Guest)),
    __param(1, (0, typeorm_1.InjectRepository)(invitation_entity_1.Invitation)),
    __param(2, (0, typeorm_1.InjectRepository)(access_assignment_entity_1.AccessAssignment)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map