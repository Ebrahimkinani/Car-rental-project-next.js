"use client"

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
}

export function AlertDialog({
  open,
  onClose,
  title,
  description,
  confirmText = "OK"
}: AlertDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-md rounded-lg border bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          {title}
        </h2>
        <p className="text-sm text-zinc-600 mb-6">
          {description}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

