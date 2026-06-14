package com.paulius.smart_pantry_backend.service;

import com.paulius.smart_pantry_backend.dto.CreateInventoryItemRequest;
import com.paulius.smart_pantry_backend.dto.InventoryItemResponse;
import com.paulius.smart_pantry_backend.dto.RestockRequest;
import com.paulius.smart_pantry_backend.entity.InventoryItem;
import com.paulius.smart_pantry_backend.exception.ResourceNotFoundException;
import com.paulius.smart_pantry_backend.mapper.InventoryItemMapper;
import com.paulius.smart_pantry_backend.repository.InventoryItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryItemService {

    private final InventoryItemRepository itemRepository;
    private final InventoryItemMapper itemMapper;

    public InventoryItemService(
            InventoryItemRepository itemRepository,
            InventoryItemMapper itemMapper
    ) {
        this.itemRepository = itemRepository;
        this.itemMapper = itemMapper;
    }

    public List<InventoryItemResponse> getAllItems() {
        return itemRepository.findAll()
                .stream()
                .map(itemMapper :: toResponse)
                .toList();
    }

    public InventoryItemResponse createItem(CreateInventoryItemRequest request) {
        InventoryItem item = itemMapper.toEntity(request);
        InventoryItem savedItem = itemRepository.save(item);

        return itemMapper.toResponse(savedItem);
    }

    public InventoryItemResponse restockItem(Long id, RestockRequest request) {
        InventoryItem item = findItemById(id);

        item.setQuantity(item.getQuantity() + request.quantity());

        InventoryItem savedItem = itemRepository.save(item);

        return itemMapper.toResponse(savedItem);
    }

    public void deleteItem(Long id) {
        InventoryItem item = findItemById(id);
        itemRepository.delete(item);
    }

    private InventoryItem findItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventory item with id " + id + " was not found"
                        )
                );
    }
}