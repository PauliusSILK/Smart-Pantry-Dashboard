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
} from "@mui/material";
import { ApiRequestError } from "../api/itemsApi";

type CreateItemDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (
    name: string,
    quantity: number,
    minThreshold: number,
  ) => Promise<void>;
};

type FieldErrors = Partial<Record<"name" | "quantity" | "minThreshold", string>>;

export function CreateItemDialog({
  open,
  onClose,
  onCreate,
}: CreateItemDialogProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minThreshold, setMinThreshold] = useState("");
  const [creating, setCreating] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);

  const quantityValue = Number(quantity);
  const minThresholdValue = Number(minThreshold);

  function validateFields(): FieldErrors {
    const nextFieldErrors: FieldErrors = {};

    if (name.trim() === "") {
      nextFieldErrors.name = "Name is required";
    }

    if (
      quantity.trim() === "" ||
      !Number.isInteger(quantityValue) ||
      quantityValue <= 0
    ) {
      nextFieldErrors.quantity = "Quantity must be greater than zero";
    }

    if (
      minThreshold.trim() === "" ||
      !Number.isInteger(minThresholdValue) ||
      minThresholdValue < 0
    ) {
      nextFieldErrors.minThreshold =
        "Minimum threshold must be zero or greater";
    }

    return nextFieldErrors;
  }

  async function handleCreate() {
    const nextFieldErrors = validateFields();

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError(null);
      return;
    }

    setCreating(true);
    setFieldErrors({});
    setError(null);

    try {
      await onCreate(name.trim(), quantityValue, minThresholdValue);
    } catch (caughtError) {
      if (caughtError instanceof ApiRequestError) {
        setFieldErrors(caughtError.validationErrors ?? {});
        setError(caughtError.message);
      } else {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to create item.",
        );
      }

      setCreating(false);
    }
  }

  return (
    <Dialog open={open} onClose={creating ? undefined : onClose} fullWidth>
      <DialogTitle>Add item</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={Boolean(fieldErrors.name)}
            helperText={fieldErrors.name ?? " "}
            disabled={creating}
            autoFocus
            fullWidth
          />
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            error={Boolean(fieldErrors.quantity)}
            helperText={fieldErrors.quantity ?? " "}
            disabled={creating}
            fullWidth
          />
          <TextField
            label="Minimum threshold"
            type="number"
            value={minThreshold}
            onChange={(event) => setMinThreshold(event.target.value)}
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
            error={Boolean(fieldErrors.minThreshold)}
            helperText={fieldErrors.minThreshold ?? " "}
            disabled={creating}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={creating}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleCreate} disabled={creating}>
          {creating ? "Adding..." : "Add item"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
