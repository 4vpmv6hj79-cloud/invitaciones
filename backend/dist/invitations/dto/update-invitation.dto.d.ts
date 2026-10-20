export declare class ParentItemDto {
    name?: string;
    deceased?: boolean;
}
export declare class LodgingItemDto {
    name?: string;
    note?: string;
    distance?: string;
    reservationCode?: string;
    mapsUrl?: string;
}
export declare class RecommendationItemDto {
    category?: string;
    name?: string;
    mapsUrl?: string;
}
export declare class BankInfoDto {
    holder?: string;
    bank?: string;
    clabe?: string;
    note?: string;
}
export declare class GiftRegistryItemDto {
    name?: string;
    url?: string;
    note?: string;
}
export declare class EventDataDto {
    coupleOrHonoree?: string;
    message?: string;
    date?: string;
    time?: string;
    endTime?: string;
    timezone?: string;
    locationName?: string;
    mapsUrl?: string;
    showCountdown?: boolean;
    rsvpMode?: string;
    rsvpCompanions?: number;
    coverImageUrl?: string;
    coverStyle?: string;
    coverSize?: string;
    coverWidthPct?: number;
    galleryItemPct?: number;
    galleryImages?: string[];
    religiousEnabled?: boolean;
    religiousTitle?: string;
    religiousSameLocation?: boolean;
    religiousTime?: string;
    religiousLocationName?: string;
    religiousMapsUrl?: string;
    galleryMosaic?: boolean;
    dressCode?: string;
    dressCodeNote?: string;
    dressCodeImages?: string[];
    giftInfo?: string;
    musicUrl?: string;
    sectionImages?: string[];
    parentsTitle?: string;
    parents?: ParentItemDto[];
    lodgingTitle?: string;
    lodging?: LodgingItemDto[];
    recommendationsTitle?: string;
    recommendationsNote?: string;
    recommendations?: RecommendationItemDto[];
    weatherNote?: string;
    bankInfo?: BankInfoDto;
    giftRegistries?: GiftRegistryItemDto[];
}
export declare class UpdateInvitationDto {
    title?: string;
    plan?: string;
    eventData?: EventDataDto;
    customization?: Record<string, unknown>;
}
