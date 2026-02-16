/**
 * Utility functions for admin access control
 */

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

export function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
  if (!adminEmailsEnv) return [];

  return adminEmailsEnv.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
}

export function getAdminEmail(): string {
  const adminEmails = getAdminEmails();
  return adminEmails[0] || "";
}

export function requireAdminAccess(userEmail: string | null | undefined): void {
  if (!isAdminEmail(userEmail)) {
    throw new Error("Admin access required");
  }
}
