"use client";

import { useRef, useState, useTransition } from "react";
import ConfirmModal from "@/components/ConfirmModal";

export default function DeleteButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
      >
        Delete
      </button>

      <ConfirmModal
        open={open}
        title="Delete this tutorial?"
        description={`"${title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        pending={pending}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          startTransition(() => {
            buttonRef.current?.closest("form")?.requestSubmit();
          });
        }}
      />
    </>
  );
}
