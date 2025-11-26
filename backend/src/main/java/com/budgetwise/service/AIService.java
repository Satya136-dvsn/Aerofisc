package com.budgetwise.service;

import com.budgetwise.config.ExternalApiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private final ExternalApiConfig apiConfig;
    private final OkHttpClient client;
    private final ObjectMapper objectMapper;

    public AIService(ExternalApiConfig apiConfig) {
        this.apiConfig = apiConfig;
        this.client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Get financial advice from Google Gemini API
     *
     * @param prompt The user's financial question or context
     * @return The AI's response
     */
    public String getFinancialAdvice(String prompt) {
        try {
            // Construct Gemini API request body
            // Structure: { "contents": [{ "parts": [{ "text": "PROMPT" }] }] }
            ObjectNode rootNode = objectMapper.createObjectNode();
            ArrayNode contentsNode = rootNode.putArray("contents");
            ObjectNode contentNode = contentsNode.addObject();
            ArrayNode partsNode = contentNode.putArray("parts");
            ObjectNode partNode = partsNode.addObject();
            partNode.put("text", prompt);

            String jsonBody = objectMapper.writeValueAsString(rootNode);

            // Gemini API URL
            // Using gemini-1.5-flash for speed and efficiency, or gemini-pro
            String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                    + apiConfig.getOpenaiApiKey();

            RequestBody body = RequestBody.create(jsonBody, JSON);
            Request request = new Request.Builder()
                    .url(apiUrl)
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    logger.error("Gemini API error: {}", response.code());
                    return "I apologize, but I'm currently unable to process your request. Please try again later.";
                }

                String responseBody = response.body().string();
                JsonNode responseNode = objectMapper.readTree(responseBody);

                // Parse Gemini response
                // Structure: { "candidates": [{ "content": { "parts": [{ "text": "RESPONSE" }]
                // } }] }
                if (responseNode.has("candidates") && responseNode.get("candidates").isArray()
                        && responseNode.get("candidates").size() > 0) {
                    JsonNode candidate = responseNode.get("candidates").get(0);
                    if (candidate.has("content") && candidate.get("content").has("parts")) {
                        JsonNode parts = candidate.get("content").get("parts");
                        if (parts.isArray() && parts.size() > 0) {
                            return parts.get(0).get("text").asText();
                        }
                    }
                }

                return "I couldn't generate a response at this time.";
            }
        } catch (IOException e) {
            logger.error("Error calling Gemini API", e);
            return "An error occurred while communicating with the AI service.";
        }
    }
}
