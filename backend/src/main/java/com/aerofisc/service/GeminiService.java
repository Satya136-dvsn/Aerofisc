/*
 * Â© 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.aerofisc.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private final OkHttpClient client;
    private final ObjectMapper objectMapper;
    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public GeminiService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.client = new OkHttpClient.Builder()
                .connectTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .build();
    }

    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.isEmpty() || "placeholder-key".equals(apiKey)) {
            return "AI service is currently unavailable (API Key missing).";
        }

        try {
            // Build request body safely using ObjectMapper to prevent JSON injection
            var requestBody = objectMapper.createObjectNode();
            var contentsArray = requestBody.putArray("contents");
            var contentObj = contentsArray.addObject();
            var partsArray = contentObj.putArray("parts");
            var partObj = partsArray.addObject();
            partObj.put("text", prompt);

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            RequestBody body = RequestBody.create(jsonBody, MediaType.parse("application/json"));

            Request request = new Request.Builder()
                    .url(API_URL + "?key=" + apiKey)
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    logger.warn("AI service returned error code: {}", response.code());
                    return "AI service is temporarily unavailable.";
                }

                String responseBody = response.body().string();
                JsonNode rootNode = objectMapper.readTree(responseBody);

                JsonNode textNode = rootNode.path("candidates").get(0)
                        .path("content").path("parts").get(0)
                        .path("text");

                if (textNode.isMissingNode()) {
                    return "Sorry, I couldn't generate a response.";
                }

                return textNode.asText();
            }
        } catch (IOException e) {
            logger.error("Error communicating with AI service: {}", e.getMessage(), e);
            return "Error communicating with AI service.";
        }
    }
}


