import { adminDb } from "@/lib/firebase-admin";

export type LegalContent = {
  disclaimerHeading: string;
  disclaimerBody: string;
  privacyHeading: string;
  privacyBody: string;
  // { [languageCode]: { disclaimerBody, privacyBody } }
  translations?: Record<string, Record<string, string>>;
};

const legalDocRef = () => adminDb.collection("config").doc("legal-content");

export async function getLegalContent(): Promise<LegalContent> {
  const snap = await legalDocRef().get();
  return snap.data() as LegalContent;
}

export async function saveLegalContent(content: LegalContent): Promise<void> {
  await legalDocRef().set(content);
}
