package com.paulius.smart_pantry_backend.config;

import com.paulius.smart_pantry_backend.entity.InventoryItem;
import com.paulius.smart_pantry_backend.repository.InventoryItemRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("dev")
public class DataSeeder implements ApplicationRunner {

    private final InventoryItemRepository itemRepository;

    public DataSeeder(InventoryItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (itemRepository.count() > 0) {
            return;
        }

        List<InventoryItem> items = List.of(
                createItem("Rice", 8, 3),
                createItem("Pasta", 2, 4),
                createItem("Milk", 1, 2),
                createItem("Eggs", 12, 6),
                createItem("Chicken breast", 3, 2),
                createItem("Canned tomatoes", 5, 3),
                createItem("Potatoes", 10, 5),
                createItem("Bananas", 2, 4),
                createItem("Greek yogurt", 4, 2),
                createItem("Oats", 1, 2)
        );

        itemRepository.saveAll(items);
    }

    private InventoryItem createItem(
            String name,
            int quantity,
            int minThreshold
    ) {
        InventoryItem item = new InventoryItem();
        item.setName(name);
        item.setQuantity(quantity);
        item.setMinThreshold(minThreshold);

        return item;
    }
}