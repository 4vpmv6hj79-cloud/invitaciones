import { Invitation } from '../invitations/invitation.entity';
export declare enum OrderStatus {
    Pending = "pending",
    Paid = "paid",
    Refunded = "refunded",
    Canceled = "canceled"
}
export declare enum PaymentProvider {
    Stripe = "stripe",
    Simulated = "simulated"
}
export declare enum OrderKind {
    InvitationPublish = "invitation_publish",
    DesignService = "design_service"
}
export declare class Order {
    id: string;
    kind: OrderKind;
    invitation: Invitation | null;
    invitationId: string | null;
    designRequestId: string | null;
    amount: number;
    currency: string;
    status: OrderStatus;
    provider: PaymentProvider;
    paymentRef: string | null;
    createdAt: Date;
    updatedAt: Date;
}
