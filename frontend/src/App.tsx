import { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { createItem, deleteItem, getItems, restockItem } from "./api/itemsApi";
import { CreateItemDialog } from "./components/CreateItemDialog";
import { DeleteItemDialog } from "./components/DeleteItemDialog";
import { InventoryTable } from "./components/InventoryTable";
import { LoginForm } from "./components/LoginForm";
import { RestockDialog } from "./components/RestockDialog";
import type { Credentials } from "./api/itemsApi";
import type { InventoryItem } from "./types/inventory";

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const isAdmin = credentials?.username === "admin";

  function loadItems() {
    return getItems();
  }

  function handleLogin(nextCredentials: Credentials) {
    setCredentials(nextCredentials);
  }

  function handleLogout() {
    setCredentials(null);
    setSelectedItem(null);
    setItemToDelete(null);
    setCreateOpen(false);
  }

  async function handleCreateItem(
    name: string,
    quantity: number,
    minThreshold: number,
  ) {
    if (!credentials) {
      return;
    }

    const createdItem = await createItem(
      { name, quantity, minThreshold },
      credentials,
    );

    setItems((currentItems) => [...currentItems, createdItem]);
    setCreateOpen(false);
  }

  async function handleRestock(restockQuantity: number) {
    if (!credentials || !selectedItem) {
      return;
    }

    const updatedItem = await restockItem(
      selectedItem.id,
      { quantity: restockQuantity },
      credentials,
    );

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
    setSelectedItem(null);
  }

  async function handleDelete() {
    if (!credentials || !itemToDelete) {
      return;
    }

    const deletedItemId = itemToDelete.id;

    await deleteItem(deletedItemId, credentials);

    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== deletedItemId),
    );
    setItemToDelete(null);
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Pantry
          </Typography>

          {credentials && (
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="body2">{credentials.username}</Typography>
              {isAdmin && <Chip label="Admin" color="secondary" size="small" />}
              <Button color="inherit" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          )}
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

        {!credentials && (
          <Box sx={{ mb: 4 }}>
            <LoginForm onLogin={handleLogin} />
          </Box>
        )}

        {isAdmin && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" onClick={() => setCreateOpen(true)}>
              Add item
            </Button>
          </Box>
        )}

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
          <InventoryTable
            items={items}
            isAdmin={isAdmin}
            onRestock={setSelectedItem}
            onDelete={setItemToDelete}
          />
        )}
      </Container>

      <RestockDialog
        key={selectedItem?.id ?? "closed"}
        item={selectedItem}
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        onRestock={handleRestock}
      />
      <DeleteItemDialog
        key={itemToDelete?.id ?? "closed"}
        item={itemToDelete}
        open={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onDelete={handleDelete}
      />
      {createOpen && (
        <CreateItemDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreate={handleCreateItem}
        />
      )}
    </Box>
  );
}

export default App;
