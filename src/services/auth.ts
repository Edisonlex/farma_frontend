import { apiPost, apiGet, hasApi } from "@/lib/api";
import type { User } from "@/lib/auth";

export async function signIn(email: string, password: string): Promise<User | null> {
  if (hasApi()) {
    const res = await apiPost("/auth/login", { email, password });
    return res as User;
  }
  return null;
}

export async function signOut(): Promise<void> {
  if (hasApi()) {
    await apiPost("/auth/logout", {});
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (hasApi()) {
    const res = await apiGet("/auth/me");
    return res as User;
  }
  return null;
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean; code?: string }> {
  if (hasApi()) {
    const res = await apiPost("/auth/password/reset", { email });
    return res as { success: boolean; code?: string };
  }
  return { success: false };
}

export async function verifyResetCode(email: string, code: string): Promise<boolean> {
  if (hasApi()) {
    const res = await apiPost("/auth/password/verify", { email, code });
    return !!(res as any)?.success;
  }
  return false;
}

export async function resetPassword(email: string, newPassword: string): Promise<boolean> {
  if (hasApi()) {
    const res = await apiPost("/auth/password/apply", { email, newPassword });
    return !!(res as any)?.success;
  }
  return false;
}