import { adminDb } from "@/lib/firebase-admin";

const categoriesDocRef = () => adminDb.collection("config").doc("categories");

export async function getCategories(): Promise<string[]> {
  const snap = await categoriesDocRef().get();
  const data = snap.data() as { list?: string[] } | undefined;
  return data?.list ?? [];
}

export async function saveCategories(categories: string[]): Promise<void> {
  await categoriesDocRef().set({ list: categories });
}
