package com.paulius.smart_pantry_backend.dto;

public record CreateInventoryItemRequest(
            String name,
        Integer quantity,
        Integer minThreshold
){}
