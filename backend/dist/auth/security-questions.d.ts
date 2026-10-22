export interface SecurityQuestion {
    id: string;
    text: string;
}
export declare const SECURITY_QUESTIONS: SecurityQuestion[];
export declare function isValidQuestionId(id: string | undefined | null): boolean;
export declare function normalizeAnswer(answer: string): string;
