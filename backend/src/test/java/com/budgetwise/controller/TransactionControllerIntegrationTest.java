/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.dto.AuthResponse;
import com.budgetwise.dto.RegisterRequest;
import com.budgetwise.dto.TransactionDto;
import com.budgetwise.entity.Transaction;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class TransactionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String accessToken;

    @BeforeEach
    void setUp() throws Exception {
        // Register a user to get a token
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("txUser");
        registerRequest.setEmail("tx@example.com");
        registerRequest.setPassword("Password123@");
        registerRequest.setFirstName("Tx");
        registerRequest.setLastName("User");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andDo(res -> {
                    if (res.getResponse().getStatus() != 200) {
                        System.err.println("Setup Register Failed: " + res.getResponse().getContentAsString());
                    }
                })
                .andExpect(status().isOk())
                .andReturn();

        String responseContent = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(responseContent, AuthResponse.class);
        accessToken = authResponse.getAccessToken();
    }

    @Test
    public void shouldCreateAndListTransactions() throws Exception {
        // 1. Create Transaction
        TransactionDto transactionDto = new TransactionDto();
        transactionDto.setAmount(new BigDecimal("100.50"));
        transactionDto.setType(Transaction.TransactionType.EXPENSE);
        transactionDto.setDescription("Groceries");
        transactionDto.setTransactionDate(LocalDate.now());
        // Note: Category ID might need to be valid. Assuming system categories are
        // seeded or optional.
        // If category is required, we might need to fetch one first.
        // For now, let's assume categoryId is optional or handled gracefully if null in
        // this test context,
        // OR we can try to use a known ID if we seeded data.
        // Let's try without categoryId first, or set it to 1L assuming seeding.
        transactionDto.setCategoryId(1L);

        mockMvc.perform(post("/api/transactions")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transactionDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.description").value("Groceries"));

        // 2. List Transactions
        mockMvc.perform(get("/api/transactions")
                .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].description").value("Groceries"));
    }
}
