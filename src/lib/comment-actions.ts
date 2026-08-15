"use server";

import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { isAuthed } from "@/lib/auth";
import {
  addComment,
  approveComment,
  deleteComment,
} from "@/lib/comments-store";

export type CommentFormState = { error?: string; success?: boolean };

export async function submitCommentAction(
  slug: string,
  _prevState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();

  if (!name || !text) {
    return { error: "Please fill in your name and comment." };
  }
  if (text.length > 1000) {
    return { error: "Comment is too long." };
  }

  await addComment({ videoSlug: slug, name, text });
  updateTag("comments");
  revalidatePath("/admin/comments");

  return { success: true };
}

export async function approveCommentAction(formData: FormData): Promise<void> {
  if (!(await isAuthed())) return;
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  await approveComment(id);
  updateTag("comments");
  revalidatePath("/admin/comments");
  revalidatePath(`/tutorial/${slug}`);
  revalidatePath("/");
}

export async function deleteCommentAction(formData: FormData): Promise<void> {
  if (!(await isAuthed())) return;
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  await deleteComment(id);
  updateTag("comments");
  revalidatePath("/admin/comments");
  revalidatePath(`/tutorial/${slug}`);
  revalidatePath("/");
}
