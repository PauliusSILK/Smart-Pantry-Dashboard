import { useState } from "react";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import type { Credentials } from "../api/itemsApi";

type LoginFormProps = {
  onLogin: (credentials: Credentials) => void;
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onLogin({
      username,
      password,
    });
  }

  return (
    <Paper
      component="form"
      elevation={1}
      onSubmit={handleSubmit}
      sx={{ p: 3 }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Sign in for admin actions
        </Typography>
        <TextField
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          fullWidth
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
    </Paper>
  );
}
