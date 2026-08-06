import { getSiteContent } from "@/lib/site-content-store";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const content = await getSiteContent();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">About &amp; Contact Settings</h1>
      <p className="text-white/50 mb-8">
        Edit the text shown on your About and Contact pages.
      </p>
      <SettingsForm content={content} />
    </div>
  );
}
