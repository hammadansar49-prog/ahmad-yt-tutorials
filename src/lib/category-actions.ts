"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { getCategories, saveCategories } from "@/lib/categories-store";
import { getVideos, saveVideos } from "@/lib/videos-store";

export type CategoryFormState = { error?: string };

export async function addCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  if (!(await isAuthed())) return { error: "Not authorized." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Category name is required." };

  const categories = await getCategories();
  if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
    return { error: "This category already exists." };
  }

  await saveCategories([...categories, name]);

  revalidatePath("/admin/categories");
  revalidatePath("/admin/videos/new");
  return {};
}

export async function renameCategoryAction(
  oldName: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  if (!(await isAuthed())) return { error: "Not authorized." };

  const newName = String(formData.get("name") ?? "").trim();
  if (!newName) return { error: "Category name is required." };

  const categories = await getCategories();
  if (
    categories.some(
      (c) => c.toLowerCase() === newName.toLowerCase() && c !== oldName
    )
  ) {
    return { error: "Another category already has this name." };
  }

  await saveCategories(
    categories.map((c) => (c === oldName ? newName : c))
  );

  const videos = await getVideos();
  await saveVideos(
    videos.map((v) =>
      v.category === oldName ? { ...v, category: newName } : v
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/videos");
  revalidatePath("/admin/videos/new");
  return {};
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  if (!(await isAuthed())) return;

  const name = String(formData.get("name") ?? "");
  const categories = await getCategories();
  await saveCategories(categories.filter((c) => c !== name));

  const videos = await getVideos();
  const fallback = "Other";
  const hasFallback = categories.includes(fallback) && fallback !== name;
  await saveVideos(
    videos.map((v) =>
      v.category === name
        ? { ...v, category: hasFallback ? fallback : "Uncategorized" }
        : v
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/videos");
  revalidatePath("/admin/videos/new");
}
