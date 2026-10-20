export type PlanId = 'esencial' | 'premium' | 'platinum';
export interface PlanDefinition {
    id: PlanId;
    name: string;
    priceCents: number;
    features: string[];
}
export declare const PLANS: Record<PlanId, PlanDefinition>;
export declare function getPlan(id: string | undefined | null): PlanDefinition;
export declare function isValidPlan(id: string | undefined | null): id is PlanId;
