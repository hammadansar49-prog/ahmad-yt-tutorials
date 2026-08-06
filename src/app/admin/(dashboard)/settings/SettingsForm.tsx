"use client";

import { useActionState, useState } from "react";
import {
  updateSiteContentAction,
  type SiteContentFormState,
} from "@/lib/site-content-actions";
import type { SiteContent, SocialLink } from "@/lib/site-content-store";

const initialState: SiteContentFormState = {};

export default function SettingsForm({ content }: { content: SiteContent }) {
  const [state, formAction, pending] = useActionState(
    updateSiteContentAction,
    initialState
  );
  const [socials, setSocials] = useState<SocialLink[]>(
    content.socials.length
      ? content.socials
      : [{ name: "", handle: "", url: "" }]
  );

  function updateSocial(index: number, field: keyof SocialLink, value: string) {
    setSocials((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addSocial() {
    setSocials((prev) => [...prev, { name: "", handle: "", url: "" }]);
  }

  function removeSocial(index: number) {
    setSocials((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="space-y-10 max-w-2xl">
      <section>
        <h2 className="text-lg font-bold text-white mb-4">About Page</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Heading *
            </label>
            <input
              name="aboutHeading"
              required
              defaultValue={content.aboutHeading}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Description
            </label>
            <textarea
              name="aboutDescription"
              rows={3}
              defaultValue={content.aboutDescription}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white focus:outline-none focus:border-[#ff6a3d]/60 transition resize-none"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-4">Contact Page</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Heading *
            </label>
            <input
              name="contactHeading"
              required
              defaultValue={content.contactHeading}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Description
            </label>
            <textarea
              name="contactDescription"
              rows={2}
              defaultValue={content.contactDescription}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white focus:outline-none focus:border-[#ff6a3d]/60 transition resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Email *
              </label>
              <input
                name="email"
                type="email"
                required
                defaultValue={content.email}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                YouTube Channel URL *
              </label>
              <input
                name="youtubeUrl"
                type="url"
                required
                defaultValue={content.youtubeUrl}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Social Links</h2>
          <button
            type="button"
            onClick={addSocial}
            className="text-sm text-[#ff8a1c] font-semibold hover:underline"
          >
            + Add Social Link
          </button>
        </div>

        <div className="space-y-4">
          {socials.map((social, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.4fr_auto] gap-2 items-start rounded-lg border border-white/10 p-3"
            >
              <input
                name="socialName"
                placeholder="Name (e.g. YouTube)"
                value={social.name}
                onChange={(e) => updateSocial(i, "name", e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
              />
              <input
                name="socialHandle"
                placeholder="Handle"
                value={social.handle}
                onChange={(e) => updateSocial(i, "handle", e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
              />
              <input
                name="socialUrl"
                placeholder="https://..."
                value={social.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
              />
              <button
                type="button"
                onClick={() => removeSocial(i)}
                className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-emerald-400">Settings saved successfully.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white font-semibold px-6 py-2.5 hover:brightness-110 transition disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
