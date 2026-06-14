package com.paulius.smart_pantry_backend.controller;

import com.paulius.smart_pantry_backend.dto.CreateInventoryItemRequest;
import com.paulius.smart_pantry_backend.dto.InventoryItemResponse;
import com.paulius.smart_pantry_backend.dto.RestockRequest;
import com.paulius.smart_pantry_backend.service.InventoryItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class InventoryItemController {

    private final InventoryItemService inventoryItemService;

    public InventoryItemController(
            InventoryItemService inventoryItemService
    ) {
        this.inventoryItemService = inventoryItemService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItemResponse>> getAllItems() {
        return ResponseEntity.ok(inventoryItemService.getAllItems());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<InventoryItemResponse> createItem(
            @Valid @RequestBody CreateInventoryItemRequest request
    ) {
        InventoryItemResponse createdItem =
                inventoryItemService.createItem(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdItem);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/restock")
    public ResponseEntity<InventoryItemResponse> restockItem(
            @PathVariable Long id,
            @Valid @RequestBody RestockRequest request
    ) {
        return ResponseEntity.ok(
                inventoryItemService.restockItem(id, request)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        inventoryItemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}