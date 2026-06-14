package com.paulius.smart_pantry_backend.mapper;

import com.paulius.smart_pantry_backend.dto.InventoryItemResponse;
import com.paulius.smart_pantry_backend.entity.InventoryItem;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class InventoryItemMapperTest {

    private final InventoryItemMapper itemMapper =
            new InventoryItemMapper();

    @Test
    void toResponse_WhenQuantityEqualsThreshold_ReturnsNotLowStock() {
        InventoryItem item = createItem(5, 5);

        InventoryItemResponse response = itemMapper.toResponse(item);

        assertFalse(response.isLowStock());
    }

    @Test
    void toResponse_WhenQuantityIsBelowThreshold_ReturnsLowStock() {
        InventoryItem item = createItem(4, 5);

        InventoryItemResponse response = itemMapper.toResponse(item);

        assertTrue(response.isLowStock());
    }

    private InventoryItem createItem(
            int quantity,
            int minThreshold
    ) {
        InventoryItem item = new InventoryItem();
        item.setId(1L);
        item.setName("Rice");
        item.setQuantity(quantity);
        item.setMinThreshold(minThreshold);

        return item;
    }
}
