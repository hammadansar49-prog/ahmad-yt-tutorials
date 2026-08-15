import { unstable_cache } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";

const categoriesDocRef = () => adminDb.collection("config").doc("categories");

async function fetchCategories(): Promise<string[]> {
  const snap = await categoriesDocRef().get();
  const data = snap.data() as { list?: string[] } | undefined;
  return data?.list ?? [];
}

export const getCategories = unstable_cache(fetchCategories, ["categories"], {
  tags: ["categories"],
});

export async function saveCategories(categories: string[]): Promise<void> {
  await categoriesDocRef().set({ list: categories });
}
