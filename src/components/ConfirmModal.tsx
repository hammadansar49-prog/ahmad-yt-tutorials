"use client";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1330] p-6 shadow-2xl shadow-black/50"
      >
        <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-white/60 mb-6">{description}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/5 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={
              danger
                ? "rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition disabled:opacity-60"
                : "rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition disabled:opacity-60"
            }
          >
            {pending ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
