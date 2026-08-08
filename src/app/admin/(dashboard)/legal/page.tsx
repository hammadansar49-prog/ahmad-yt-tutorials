import { getLegalContent } from "@/lib/legal-content-store";
import LegalForm from "./LegalForm";

export const dynamic = "force-dynamic";

export default async function LegalPage() {
  const content = await getLegalContent();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Disclaimer & Privacy Policy</h1>
      <p className="text-white/50 mb-8">
        Edit the text shown on your Disclaimer and Privacy Policy pages.
      </p>
      <LegalForm content={content} />
    </div>
  );
}
