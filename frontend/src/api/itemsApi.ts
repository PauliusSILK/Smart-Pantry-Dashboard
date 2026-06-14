import type {
  ApiError,
  CreateItemRequest,
  InventoryItem,
  RestockRequest,
} from "../types/inventory";

export type Credentials = {
  username: string;
  password: string;
};

export class ApiRequestError extends Error {
  validationErrors?: Record<string, string>;

  constructor(message: string, validationErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiRequestError";
    this.validationErrors = validationErrors;
  }
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"
).replace(/\/$/, "");

const itemsUrl = `${API_BASE_URL}/api/items`;

function createAuthHeader(credentials: Credentials): string {
  return `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
}

function authHeaders(credentials: Credentials): HeadersInit {
  return {
    Authorization: createAuthHeader(credentials),
  };
}

function jsonHeaders(credentials: Credentials): HeadersInit {
  return {
    ...authHeaders(credentials),
    "Content-Type": "application/json",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiError(value: unknown): value is ApiError {
  return (
    isRecord(value) &&
    typeof value.timestamp === "string" &&
    typeof value.status === "number" &&
    typeof value.error === "string" &&
    typeof value.message === "string" &&
    (value.validationErrors === undefined || isStringRecord(value.validationErrors))
  );
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

async function throwApiError(response: Response): Promise<never> {
  const body = await readJson(response);

  if (isApiError(body)) {
    throw new ApiRequestError(
      `${body.error}: ${body.message}`,
      body.validationErrors,
    );
  }

  throw new Error(`Request failed with status ${response.status}`);
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    await throwApiError(response);
  }

  return (await response.json()) as T;
}

export async function getItems(): Promise<InventoryItem[]> {
  const response = await fetch(itemsUrl);

  return readResponse<InventoryItem[]>(response);
}

export async function createItem(
  request: CreateItemRequest,
  credentials: Credentials,
): Promise<InventoryItem> {
  const response = await fetch(itemsUrl, {
    method: "POST",
    headers: jsonHeaders(credentials),
    body: JSON.stringify(request),
  });

  return readResponse<InventoryItem>(response);
}

export async function restockItem(
  id: number,
  request: RestockRequest,
  credentials: Credentials,
): Promise<InventoryItem> {
  const response = await fetch(`${itemsUrl}/${id}/restock`, {
    method: "PATCH",
    headers: jsonHeaders(credentials),
    body: JSON.stringify(request),
  });

  return readResponse<InventoryItem>(response);
}

export async function deleteItem(
  id: number,
  credentials: Credentials,
): Promise<void> {
  const response = await fetch(`${itemsUrl}/${id}`, {
    method: "DELETE",
    headers: authHeaders(credentials),
  });

  if (!response.ok) {
    await throwApiError(response);
  }
}
