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
    coverImageUrl?: string;
    coverStyle?: string;
    coverSize?: string;
    coverWidthPct?: number;
    galleryItemPct?: number;
    galleryImages?: string[];
    religiousEnabled?: boolean;
    religiousSameLocation?: boolean;
    religiousTime?: string;
    religiousLocationName?: string;
    religiousMapsUrl?: string;
}
export declare class UpdateInvitationDto {
    title?: string;
    eventData?: EventDataDto;
    customization?: Record<string, unknown>;
}
