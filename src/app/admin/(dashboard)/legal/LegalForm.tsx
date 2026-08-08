"use client";

import { useActionState } from "react";
import {
  updateLegalContentAction,
  type LegalContentFormState,
} from "@/lib/legal-content-actions";
import type { LegalContent } from "@/lib/legal-content-store";

const initialState: LegalContentFormState = {};

export default function LegalForm({ content }: { content: LegalContent }) {
  const [state, formAction, pending] = useActionState(
    updateLegalContentAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-10 max-w-2xl">
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Disclaimer Page</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Heading *
            </label>
            <input
              name="disclaimerHeading"
              required
              defaultValue={content.disclaimerHeading}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Body *
            </label>
            <textarea
              name="disclaimerBody"
              rows={8}
              required
              defaultValue={content.disclaimerBody}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
            />
            <p className="mt-1.5 text-xs text-white/40">
              Use a blank line to start a new paragraph.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-4">Privacy Policy Page</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Heading *
            </label>
            <input
              name="privacyHeading"
              required
              defaultValue={content.privacyHeading}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Body *
            </label>
            <textarea
              name="privacyBody"
              rows={8}
              required
              defaultValue={content.privacyBody}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
            />
            <p className="mt-1.5 text-xs text-white/40">
              Use a blank line to start a new paragraph.
            </p>
          </div>
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
