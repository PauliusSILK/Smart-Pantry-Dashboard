import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { InventoryItem } from "../types/inventory";

type RestockDialogProps = {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
  onRestock: (restockQuantity: number) => Promise<void>;
};

export function RestockDialog({
  item,
  open,
  onClose,
  onRestock,
}: RestockDialogProps) {
  const [restockQuantity, setRestockQuantity] = useState("");
  const [restocking, setRestocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quantity = Number(restockQuantity);
  const isValidQuantity =
    restockQuantity.trim() !== "" &&
    Number.isInteger(quantity) &&
    quantity > 0;

  async function handleRestock() {
    if (!isValidQuantity) {
      setError("Enter a positive whole number.");
      return;
    }

    setRestocking(true);
    setError(null);

    try {
      await onRestock(quantity);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to restock item.",
      );
      setRestocking(false);
    }
  }

  return (
    <Dialog open={open} onClose={restocking ? undefined : onClose} fullWidth>
      <DialogTitle>Restock item</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body1">
            {item ? `Add stock for ${item.name}` : "Add stock"}
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Quantity"
            type="number"
            value={restockQuantity}
            onChange={(event) => setRestockQuantity(event.target.value)}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            error={restockQuantity !== "" && !isValidQuantity}
            helperText={
              restockQuantity !== "" && !isValidQuantity
                ? "Enter a positive whole number."
                : " "
            }
            disabled={restocking}
            autoFocus
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={restocking}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleRestock}
          disabled={!isValidQuantity || restocking}
        >
          {restocking ? "Restocking..." : "Restock"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
