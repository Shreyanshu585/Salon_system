import { Dialog } from "./Dialog";
import { Button } from "./Button";

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", loading, destructive }) {
  return (
    <Dialog open={open} onClose={onClose} title={title} description={description}>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={destructive ? "destructive" : "primary"} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </Dialog>
  );
}
