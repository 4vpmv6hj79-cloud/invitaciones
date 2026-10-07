"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const guest_entity_1 = require("./guest.entity");
const guest_group_entity_1 = require("./guest-group.entity");
const invitations_service_1 = require("../invitations/invitations.service");
let GuestsService = class GuestsService {
    constructor(guests, groups, invitations) {
        this.guests = guests;
        this.groups = groups;
        this.invitations = invitations;
    }
    async assertOwner(invitationId, ownerId) {
        await this.invitations.findOwned(invitationId, ownerId);
    }
    async createGuest(invitationId, dto) {
        const guest = this.guests.create({
            invitationId,
            name: dto.name,
            contact: dto.contact ?? null,
            allowedSeats: dto.allowedSeats,
            groupId: dto.groupId ?? null,
            accessToken: (0, crypto_1.randomBytes)(18).toString('hex'),
        });
        return this.guests.save(guest);
    }
    async createGroup(invitationId, dto) {
        const group = this.groups.create({
            invitationId,
            name: dto.name,
            allowedSeats: dto.allowedSeats,
        });
        return this.groups.save(group);
    }
    async listGuests(invitationId) {
        return this.guests.find({
            where: { invitationId },
            order: { createdAt: 'ASC' },
        });
    }
    async summary(invitationId) {
        const guests = await this.listGuests(invitationId);
        return {
            total: guests.length,
            confirmed: guests.filter((g) => g.rsvpStatus === guest_entity_1.RsvpStatus.Confirmed).length,
            declined: guests.filter((g) => g.rsvpStatus === guest_entity_1.RsvpStatus.Declined).length,
            pending: guests.filter((g) => g.rsvpStatus === guest_entity_1.RsvpStatus.Pending).length,
            seatsConfirmed: guests.reduce((sum, g) => sum + g.confirmedSeats, 0),
            seatsAllowed: guests.reduce((sum, g) => sum + g.allowedSeats, 0),
        };
    }
    async removeGuest(invitationId, guestId) {
        const guest = await this.guests.findOne({ where: { id: guestId, invitationId } });
        if (!guest) {
            throw new common_1.NotFoundException('Invitado no encontrado');
        }
        await this.guests.remove(guest);
    }
    async getByToken(token) {
        const guest = await this.guests.findOne({ where: { accessToken: token } });
        if (!guest) {
            throw new common_1.NotFoundException('Invitación no encontrada');
        }
        return guest;
    }
    async respond(token, dto) {
        const guest = await this.getByToken(token);
        if (dto.status === 'declined') {
            guest.rsvpStatus = guest_entity_1.RsvpStatus.Declined;
            guest.confirmedSeats = 0;
        }
        else {
            const seats = dto.seats ?? 1;
            if (seats < 1) {
                throw new common_1.BadRequestException('Debes confirmar al menos un lugar');
            }
            if (seats > guest.allowedSeats) {
                throw new common_1.BadRequestException(`Solo tienes ${guest.allowedSeats} lugar(es) autorizado(s)`);
            }
            guest.rsvpStatus = guest_entity_1.RsvpStatus.Confirmed;
            guest.confirmedSeats = seats;
        }
        if (dto.dietaryNotes !== undefined) {
            guest.dietaryNotes = dto.dietaryNotes;
        }
        guest.respondedAt = new Date();
        return this.guests.save(guest);
    }
    async exportCsv(invitationId) {
        const guests = await this.listGuests(invitationId);
        const header = 'nombre,contacto,lugares_autorizados,estado,lugares_confirmados';
        const rows = guests.map((g) => [
            this.csvCell(g.name),
            this.csvCell(g.contact ?? ''),
            g.allowedSeats,
            g.rsvpStatus,
            g.confirmedSeats,
        ].join(','));
        return [header, ...rows].join('\n');
    }
    async importCsv(invitationId, csv) {
        const lines = csv
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter((l) => l.length > 0);
        const start = lines[0]?.toLowerCase().includes('nombre') ? 1 : 0;
        let imported = 0;
        for (let i = start; i < lines.length; i++) {
            const cols = this.parseCsvLine(lines[i]);
            const name = cols[0]?.trim();
            if (!name)
                continue;
            const contact = cols[1]?.trim() || null;
            const seats = Number.parseInt(cols[2] ?? '1', 10);
            const allowedSeats = Number.isFinite(seats) && seats > 0 ? seats : 1;
            await this.guests.save(this.guests.create({
                invitationId,
                name,
                contact,
                allowedSeats,
                accessToken: (0, crypto_1.randomBytes)(18).toString('hex'),
            }));
            imported += 1;
        }
        return { imported };
    }
    csvCell(value) {
        if (/[",\n]/.test(value)) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
    parseCsvLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (inQuotes) {
                if (ch === '"' && line[i + 1] === '"') {
                    current += '"';
                    i++;
                }
                else if (ch === '"') {
                    inQuotes = false;
                }
                else {
                    current += ch;
                }
            }
            else if (ch === '"') {
                inQuotes = true;
            }
            else if (ch === ',') {
                result.push(current);
                current = '';
            }
            else {
                current += ch;
            }
        }
        result.push(current);
        return result;
    }
};
exports.GuestsService = GuestsService;
exports.GuestsService = GuestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(guest_entity_1.Guest)),
    __param(1, (0, typeorm_1.InjectRepository)(guest_group_entity_1.GuestGroup)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        invitations_service_1.InvitationsService])
], GuestsService);
//# sourceMappingURL=guests.service.js.map