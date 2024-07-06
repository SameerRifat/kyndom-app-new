import { SubscriptionTariff, UserRole } from "@prisma/client";

export enum Permission {
    ROLE_USER,
    ROLE_DESIGNER,
    ROLE_ADMIN,
    ACTIVE_SUBSCRIPTION
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.USER]: [Permission.ROLE_USER],
    [UserRole.DESIGNER]: [Permission.ROLE_USER, Permission.ACTIVE_SUBSCRIPTION, Permission.ROLE_DESIGNER],
    [UserRole.ADMIN]: [Permission.ROLE_USER, Permission.ACTIVE_SUBSCRIPTION, Permission.ROLE_DESIGNER, Permission.ROLE_ADMIN]
};

export const SUBSCRIPTION_PERMISSIONS: Record<SubscriptionTariff, Permission[]> = {
    [SubscriptionTariff.LIFETIME_SPECIAL]: [Permission.ACTIVE_SUBSCRIPTION]
};