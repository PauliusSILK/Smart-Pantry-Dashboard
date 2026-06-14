package com.paulius.smart_pantry_backend.mapper;

import com.paulius.smart_pantry_backend.dto.CreateInventoryItemRequest;
import com.paulius.smart_pantry_backend.dto.InventoryItemResponse;
import com.paulius.smart_pantry_backend.entity.InventoryItem;
import org.springframework.stereotype.Component;

@Component
public class InventoryItemMapper {

    public InventoryItem toEntity(CreateInventoryItemRequest request) {
        InventoryItem item = new InventoryItem();

        item.setName(request.name());
        item.setQuantity(request.quantity());
        item.setMinThreshold(request.minThreshold());

        return item;
    }

    public InventoryItemResponse toResponse(InventoryItem item) {
        return new InventoryItemResponse(
                item.getId(),
                item.getName(),
                item.getQuantity(),
                item.getMinThreshold(),
                item.getQuantity() < item.getMinThreshold()
        );
    }
}