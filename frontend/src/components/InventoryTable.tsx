import {
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { alpha } from "@mui/material/styles";
import type { InventoryItem } from "../types/inventory";

type InventoryTableProps = {
  items: InventoryItem[];
  isAdmin: boolean;
  onRestock: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
};

export function InventoryTable({
  items,
  isAdmin,
  onRestock,
  onDelete,
}: InventoryTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Inventory items">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Minimum threshold</TableCell>
            <TableCell>Status</TableCell>
            {isAdmin && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              sx={(theme) =>
                item.isLowStock
                  ? {
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.error.main, 0.12),
                      },
                    }
                  : {}
              }
            >
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{item.minThreshold}</TableCell>
              <TableCell>
                <Chip
                  label={item.isLowStock ? "Low stock" : "In stock"}
                  color={item.isLowStock ? "error" : "success"}
                  size="small"
                  variant={item.isLowStock ? "filled" : "outlined"}
                />
              </TableCell>
              {isAdmin && (
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onRestock(item)}
                    sx={{ mr: 1 }}
                  >
                    Restock
                  </Button>
                  <Tooltip title={`Delete ${item.name}`}>
                    <IconButton
                      aria-label={`Delete ${item.name}`}
                      color="error"
                      size="small"
                      onClick={() => onDelete(item)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
