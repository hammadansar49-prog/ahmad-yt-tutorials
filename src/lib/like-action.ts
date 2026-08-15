"use server";

import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { toggleLike } from "@/lib/videos-store";

export async function likeVideoAction(
  slug: string,
  liked: boolean
): Promise<number> {
  const likes = await toggleLike(slug, liked);
  updateTag("videos");
  revalidatePath("/");
  revalidatePath(`/tutorial/${slug}`);
  revalidatePath("/admin/videos");
  return likes;
}
