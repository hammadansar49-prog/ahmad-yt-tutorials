"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { saveSiteContent, type SocialLink } from "@/lib/site-content-store";
import { translateFields } from "@/lib/translate";

export type SiteContentFormState = { error?: string; success?: boolean };

export async function updateSiteContentAction(
  _prevState: SiteContentFormState,
  formData: FormData
): Promise<SiteContentFormState> {
  if (!(await isAuthed())) return { error: "Not authorized." };

  const aboutHeading = String(formData.get("aboutHeading") ?? "").trim();
  const aboutDescription = String(formData.get("aboutDescription") ?? "").trim();
  const contactHeading = String(formData.get("contactHeading") ?? "").trim();
  const contactDescription = String(
    formData.get("contactDescription") ?? ""
  ).trim();
  const email = String(formData.get("email") ?? "").trim();
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim();

  const socialNames = formData.getAll("socialName") as string[];
  const socialHandles = formData.getAll("socialHandle") as string[];
  const socialUrls = formData.getAll("socialUrl") as string[];

  const socials: SocialLink[] = socialNames
    .map((name, i) => ({
      name: name.trim(),
      handle: (socialHandles[i] ?? "").trim(),
      url: (socialUrls[i] ?? "").trim(),
    }))
    .filter((s) => s.name && s.url);

  if (!aboutHeading || !contactHeading || !email || !youtubeUrl) {
    return { error: "Please fill in all required fields." };
  }

  const translations = await translateFields({
    aboutDescription,
    contactDescription,
  }).catch(() => undefined);

  await saveSiteContent({
    aboutHeading,
    aboutDescription,
    contactHeading,
    contactDescription,
    email,
    youtubeUrl,
    socials,
    translations,
  });

  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");

  return { success: true };
}
