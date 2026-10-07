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
    createdAt: Date;
}
