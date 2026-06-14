export type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  minThreshold: number;
  isLowStock: boolean;
};

export type CreateItemRequest = {
  name: string;
  quantity: number;
  minThreshold: number;
};

export type RestockRequest = {
  quantity: number;
};

export type ApiError = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  validationErrors?: Record<string, string>;
};
