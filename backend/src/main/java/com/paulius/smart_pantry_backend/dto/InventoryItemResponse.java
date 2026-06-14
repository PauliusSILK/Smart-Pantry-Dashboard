package com.paulius.smart_pantry_backend.dto;

public record InventoryItemResponse(
        Long id,
        String name,
        Integer quantity,
        Integer minThreshold,
        boolean isLowStock
) {
}
