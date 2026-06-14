package com.paulius.smart_pantry_backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateInventoryItemRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be positive")
        Integer quantity,

        @NotNull(message = "Minimum threshold is required")
        @Min(value = 0, message = "Minimum threshold cannot be negative")
        Integer minThreshold
){}
