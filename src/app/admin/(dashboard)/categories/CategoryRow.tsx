"use client";

import { useActionState, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import {
  renameCategoryAction,
  deleteCategoryAction,
  type CategoryFormState,
} from "@/lib/category-actions";

const initialState: CategoryFormState = {};

export default function CategoryRow({
  name,
  videoCount,
}: {
  name: string;
  videoCount: number;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const boundRename = renameCategoryAction.bind(null, name);
  const [state, formAction, pending] = useActionState(
    boundRename,
    initialState
  );

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d1330]/80 p-4">
      {editing ? (
        <form action={formAction} className="flex-1 flex items-center gap-2">
          <input
            name="name"
            defaultValue={name}
            autoFocus
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] px-3 py-2 text-xs font-semibold text-white hover:brightness-110 transition disabled:opacity-60"
          >
            {pending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 transition"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="flex-1">
            <span className="text-white font-medium">{name}</span>
            <span className="ml-2 text-xs text-white/40">
              {videoCount} tutorial{videoCount !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 transition"
          >
            Rename
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
          >
            Delete
          </button>
        </>
      )}

      {state.error && (
        <p className="text-xs text-red-400 absolute mt-12">{state.error}</p>
      )}

      <ConfirmModal
        open={confirmOpen}
        title={`Delete "${name}"?`}
        description={
          videoCount > 0
            ? `${videoCount} tutorial${videoCount !== 1 ? "s" : ""} using this category will be moved to "Other".`
            : "This category isn't used by any tutorial."
        }
        confirmLabel="Delete"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          const form = document.getElementById(
            `delete-category-${name}`
          ) as HTMLFormElement;
          form?.requestSubmit();
        }}
      />

      <form
        id={`delete-category-${name}`}
        action={deleteCategoryAction}
        className="hidden"
      >
        <input type="hidden" name="name" value={name} />
      </form>
    </div>
  );
}
