"use client";

import { useActionState, useRef } from "react";
import { addCategoryAction, type CategoryFormState } from "@/lib/category-actions";

const initialState: CategoryFormState = {};

export default function AddCategoryForm() {
  const [state, formAction, pending] = useActionState(
    addCategoryAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex items-start gap-2 mb-6"
    >
      <div className="flex-1">
        <input
          name="name"
          required
          placeholder="e.g. AI Prompts, Voice Cloning..."
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition"
        />
        {state.error && (
          <p className="text-xs text-red-400 mt-1.5">{state.error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition disabled:opacity-60 shrink-0"
      >
        {pending ? "Adding..." : "+ Add Category"}
      </button>
    </form>
  );
}
