import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/categories.json");

export async function getCategories(): Promise<string[]> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as string[];
}

export async function saveCategories(categories: string[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(categories, null, 2), "utf-8");
}
