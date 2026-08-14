"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, verifyAdminIdToken } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginWithFirebaseAction(idToken: string): Promise<LoginState> {
  const result = await verifyAdminIdToken(idToken);
  if (!result.ok) {
    return { error: result.error };
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
