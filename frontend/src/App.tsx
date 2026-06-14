import { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { getItems } from "./api/itemsApi";
import { InventoryTable } from "./components/InventoryTable";
import type { InventoryItem } from "./types/inventory";

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function loadItems() {
    return getItems();
  }

  useEffect(() => {
    let ignore = false;

    void loadItems()
      .then((loadedItems) => {
        if (!ignore) {
          setItems(loadedItems);
          setError(null);
        }
      })
      .catch((caughtError: unknown) => {
        if (!ignore) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Failed to load inventory items",
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Smart Pantry
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        component="main"
        maxWidth="md"
        sx={{ py: { xs: 4, md: 6 } }}
      >
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Pantry inventory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review current stock levels and spot items that need attention.
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress aria-label="Loading inventory" />
          </Box>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && items.length === 0 && (
          <Alert severity="info">No inventory items found.</Alert>
        )}

        {!loading && !error && items.length > 0 && (
          <InventoryTable items={items} />
        )}
      </Container>
    </Box>
  );
}

export default App;
