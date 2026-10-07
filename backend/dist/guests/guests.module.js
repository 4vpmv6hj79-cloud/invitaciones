"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const guest_entity_1 = require("./guest.entity");
const guest_group_entity_1 = require("./guest-group.entity");
const guests_service_1 = require("./guests.service");
const guests_controller_1 = require("./guests.controller");
const rsvp_controller_1 = require("./rsvp.controller");
const invitations_module_1 = require("../invitations/invitations.module");
let GuestsModule = class GuestsModule {
};
exports.GuestsModule = GuestsModule;
exports.GuestsModule = GuestsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([guest_entity_1.Guest, guest_group_entity_1.GuestGroup]),
            invitations_module_1.InvitationsModule,
        ],
        controllers: [guests_controller_1.GuestsController, rsvp_controller_1.RsvpController],
        providers: [guests_service_1.GuestsService],
        exports: [guests_service_1.GuestsService],
    })
], GuestsModule);
//# sourceMappingURL=guests.module.js.map