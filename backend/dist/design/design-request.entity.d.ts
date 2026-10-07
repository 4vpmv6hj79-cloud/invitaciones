export declare enum DesignStatus {
    Nueva = "nueva",
    EnProceso = "en_proceso",
    Propuesta = "propuesta",
    Aprobada = "aprobada",
    Rechazada = "rechazada",
    AjusteSolicitado = "ajuste_solicitado"
}
export declare class DesignRequest {
    id: string;
    requesterId: string;
    title: string;
    eventType: string;
    style: string;
    details: string;
    budget?: string | null;
    status: DesignStatus;
    priceCents: number | null;
    paid: boolean;
    revisionsUsed: number;
    revisionLimit: number;
    createdAt: Date;
    updatedAt: Date;
}
