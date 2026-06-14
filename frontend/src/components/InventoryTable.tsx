import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { InventoryItem } from "../types/inventory";

type InventoryTableProps = {
  items: InventoryItem[];
};

export function InventoryTable({ items }: InventoryTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Inventory items">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Minimum threshold</TableCell>
            <TableCell>Status</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
