import { useId, useRef, useState } from 'react';
import Button from './Button';

interface DeleteButtonProps {
  itemName: string;
  disabled?: boolean;
  onDelete: () => Promise<void>;
}

export default function DeleteButton({
  itemName,
  disabled = false,
  onDelete,
}: DeleteButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  function openConfirmation() {
    setError(null);
    dialogRef.current?.showModal();
    cancelRef.current?.focus();
  }

  async function confirmDelete() {
    if (disabled || pendingRef.current) return;

    pendingRef.current = true;
    setIsDeleting(true);
    setError(null);

    try {
      await onDelete();
      dialogRef.current?.close();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to delete this item.',
      );
    } finally {
      pendingRef.current = false;
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button
        variant="plain"
        disabled={disabled || isDeleting}
        aria-label={`Delete ${itemName}`}
        aria-haspopup="dialog"
        onClick={openConfirmation}
        className="inline-flex min-h-9 items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 hover:text-red-800"
      >
        Delete
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          if (pendingRef.current) event.preventDefault();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md whitespace-normal rounded-xl border border-border bg-surface p-6 text-left text-text shadow-xl backdrop:bg-slate-950/40"
      >
        <h2 id={titleId} className="break-words text-lg font-semibold">
          Delete {itemName}?
        </h2>
        <p id={descriptionId} className="mt-2 text-sm text-muted">
          This cannot be undone.
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            ref={cancelRef}
            variant="plain"
            disabled={isDeleting}
            onClick={() => dialogRef.current?.close()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            variant="plain"
            disabled={disabled || isDeleting}
            onClick={() => void confirmDelete()}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </dialog>
    </>
  );
}
