package com.paulius.smart_pantry_backend.controller;

import com.paulius.smart_pantry_backend.repository.InventoryItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class InventoryItemControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InventoryItemRepository itemRepository;

    @BeforeEach
    void setUp() {
        itemRepository.deleteAll();
    }

    @Test
    void createItem_WithoutCredentials_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Rice",
                                  "quantity": 5,
                                  "minThreshold": 2
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createItem_WithAdminCredentials_ReturnsCreated() throws Exception {
        mockMvc.perform(post("/api/items")
                        .with(httpBasic("admin", "password"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Rice",
                                  "quantity": 5,
                                  "minThreshold": 2
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Rice"))
                .andExpect(jsonPath("$.quantity").value(5))
                .andExpect(jsonPath("$.minThreshold").value(2))
                .andExpect(jsonPath("$.isLowStock").value(false));
    }
}