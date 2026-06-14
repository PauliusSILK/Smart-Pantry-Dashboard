import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { InventoryItem } from "../types/inventory";

type DeleteItemDialogProps = {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
};

export function DeleteItemDialog({
  item,
  open,
  onClose,
  onDelete,
}: DeleteItemDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      await onDelete();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to delete item.",
      );
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onClose={deleting ? undefined : onClose} fullWidth>
      <DialogTitle>Delete item</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          Delete {item?.name ?? "this item"} from the pantry inventory?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
