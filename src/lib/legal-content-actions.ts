"use server";

import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { saveLegalContent } from "@/lib/legal-content-store";
import { translateFields } from "@/lib/translate";

export type LegalContentFormState = { error?: string; success?: boolean };

export async function updateLegalContentAction(
  _prevState: LegalContentFormState,
  formData: FormData
): Promise<LegalContentFormState> {
  if (!(await isAuthed())) return { error: "Not authorized." };

  const disclaimerHeading = String(formData.get("disclaimerHeading") ?? "").trim();
  const disclaimerBody = String(formData.get("disclaimerBody") ?? "").trim();
  const privacyHeading = String(formData.get("privacyHeading") ?? "").trim();
  const privacyBody = String(formData.get("privacyBody") ?? "").trim();

  if (!disclaimerHeading || !disclaimerBody || !privacyHeading || !privacyBody) {
    return { error: "Please fill in all required fields." };
  }

  const translations = await translateFields({
    disclaimerHeading,
    disclaimerBody,
    privacyHeading,
    privacyBody,
  }).catch(() => undefined);

  await saveLegalContent({
    disclaimerHeading,
    disclaimerBody,
    privacyHeading,
    privacyBody,
    translations,
  });

  updateTag("legal-content");
  revalidatePath("/disclaimer");
  revalidatePath("/privacy-policy");
  revalidatePath("/admin/legal");

  return { success: true };
}
