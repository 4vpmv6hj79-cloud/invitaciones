export declare enum UserRole {
    Organizer = "organizer",
    Admin = "admin",
    Staff = "staff"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
    resetTokenHash?: string | null;
    resetTokenExpires?: Date | null;
    createdAt: Date;
}
