package com.paulius.smart_pantry_backend.repository;

import com.paulius.smart_pantry_backend.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface InventoryItemRepository extends JpaRepository<InventoryItem,Long> {
}
