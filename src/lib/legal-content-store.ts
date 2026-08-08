import fs from "fs/promises";
import path from "path";

export type LegalContent = {
  disclaimerHeading: string;
  disclaimerBody: string;
  privacyHeading: string;
  privacyBody: string;
};

const filePath = path.join(process.cwd(), "src/data/legal-content.json");

export async function getLegalContent(): Promise<LegalContent> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as LegalContent;
}

export async function saveLegalContent(content: LegalContent): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");
}
