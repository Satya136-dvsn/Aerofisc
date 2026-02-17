/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.dto.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldFailRegistrationWithInvalidEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("validUser");
        request.setEmail("invalid-email"); // Invalid email
        request.setPassword("Password123@");
        request.setFirstName("Valid");
        request.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.message")
                        .value(org.hamcrest.Matchers.containsString("email=Email should be valid")));
    }

    @Test
    public void shouldFailRegistrationWithWeakPassword() throws Exception {
        // 1. Missing Uppercase
        RegisterRequest request = new RegisterRequest();
        request.setUsername("validUser");
        request.setEmail("valid@example.com");
        request.setPassword("password123@"); // Missing Uppercase
        request.setFirstName("Valid");
        request.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers
                        .containsString("password=Password must contain at least one uppercase letter")));

        // 2. Missing Lowercase
        request.setPassword("PASSWORD123@"); // Missing Lowercase
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers
                        .containsString("password=Password must contain at least one uppercase letter"))); // Same
                                                                                                           // message
                                                                                                           // for all
                                                                                                           // regex
                                                                                                           // failures

        // 3. Missing Special Char
        request.setPassword("Password123"); // Missing Special Char
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers
                        .containsString("password=Password must contain at least one uppercase letter")));

        // 4. Missing Number
        request.setPassword("Password@"); // Missing Number
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers
                        .containsString("password=Password must contain at least one uppercase letter")));
    }

    @Test
    public void shouldFailRegistrationWithShortPassword() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("validUser");
        request.setEmail("valid@example.com");
        request.setPassword("short"); // Too short
        request.setFirstName("Valid");
        request.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
        // Note: It might fail both size and pattern, so we just check for validation
        // failure generally or specific message if needed.
    }

    @Test
    public void shouldFailRegistrationWithMissingFields() throws Exception {
        RegisterRequest request = new RegisterRequest();
        // Missing username, email, password, etc.

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }
}
