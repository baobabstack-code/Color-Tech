/**
 * Utility functions for admin access control
 */

export function isAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return email === process.env.ADMIN_EMAIL || email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
}

export function getAdminEmail(): string {
    return process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
}

export function requireAdminAccess(userEmail: string | null | undefined): void {
    if (!isAdminEmail(userEmail)) {
        throw new Error('Admin access required');
    }
}