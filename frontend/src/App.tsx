import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

function App() {
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
        sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Pantry inventory
        </Typography>
      </Container>
    </Box>
  );
}

export default App;
