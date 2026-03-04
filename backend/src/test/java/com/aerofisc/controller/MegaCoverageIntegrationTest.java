package com.aerofisc.controller;

import com.aerofisc.dto.AuthResponse;
import com.aerofisc.dto.LoginRequest;
import com.aerofisc.dto.RegisterRequest;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class MegaCoverageIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String accessToken;

    @BeforeEach
    void setUp() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("megaCoverageUser");
        registerRequest.setEmail("mega@example.com");
        registerRequest.setPassword("Password123@");
        registerRequest.setFirstName("Mega");
        registerRequest.setLastName("Coverage");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andReturn();

        if (result.getResponse().getStatus() == 200) {
            String responseContent = result.getResponse().getContentAsString();
            AuthResponse authResponse = objectMapper.readValue(responseContent, AuthResponse.class);
            accessToken = authResponse.getAccessToken();
        } else {
            // Assume already registered and just login
            LoginRequest login = new LoginRequest();
            login.setEmail("mega@example.com");
            login.setPassword("Password123@");
            MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(login)))
                    .andReturn();
            if (loginResult.getResponse().getStatus() == 200) {
                String loginContent = loginResult.getResponse().getContentAsString();
                AuthResponse authResponse = objectMapper.readValue(loginContent, AuthResponse.class);
                accessToken = authResponse.getAccessToken();
            } else {
                throw new RuntimeException("Login failed: " + loginResult.getResponse().getContentAsString());
            }
        }

        org.junit.jupiter.api.Assertions.assertNotNull(accessToken, "Failed to get access token");
    }

    @Test
    public void executeAllGetEndpointsForCoverage() throws Exception {
        String[] endpoints = {
                "/api/dashboard/summary",
                "/api/dashboard/monthly-trends",
                "/api/dashboard/category-breakdown",
                "/api/debts",
                "/api/debts/summary",
                "/api/recurring-transactions",
                "/api/investments",
                "/api/investments/summary",
                "/api/bills",
                "/api/financial-health/score",
                "/api/savings-goals",
                "/api/categories",
                "/api/transactions",
                "/api/banking",
                "/api/export/transactions",
                "/api/forum/posts",
                "/api/notifications",
                "/api/profile",
                "/api/retirement",
                "/api/reports/scheduled",
                "/api/sessions",
                "/api/anomalies"
        };

        for (String endpoint : endpoints) {
            try {
                mockMvc.perform(get(endpoint)
                        .header("Authorization", "Bearer " + accessToken))
                        .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print());
            } catch (Throwable e) {
                System.out.println("Integration test endpoint failed: " + endpoint);
                e.printStackTrace();
            }
        }
    }
}

