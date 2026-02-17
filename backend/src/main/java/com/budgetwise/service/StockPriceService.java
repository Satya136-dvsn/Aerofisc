/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.config.ExternalApiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;

@Service
public class StockPriceService {

    private static final Logger logger = LoggerFactory.getLogger(StockPriceService.class);
    private final ExternalApiConfig apiConfig;
    private final OkHttpClient client;
    private final ObjectMapper objectMapper;

    public StockPriceService(ExternalApiConfig apiConfig) {
        this.apiConfig = apiConfig;
        this.client = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public BigDecimal getCurrentPrice(String symbol) {
        if (symbol == null || symbol.isEmpty()) {
            return null;
        }

        String apiKey = apiConfig.getAlphaVantageApiKey();
        if (apiKey == null || apiKey.isEmpty() || "demo".equals(apiKey)) {
            logger.warn("AlphaVantage API key is missing or set to demo. Skipping price fetch for {}", symbol);
            return null;
        }

        // AlphaVantage Global Quote Endpoint
        String url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + apiKey;

        Request request = new Request.Builder()
                .url(url)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                logger.error("AlphaVantage API error: {}", response.code());
                return null;
            }

            String responseBody = response.body().string();
            JsonNode root = objectMapper.readTree(responseBody);

            // Check for error or limit message
            if (root.has("Error Message")) {
                logger.error("AlphaVantage Error: {}", root.get("Error Message").asText());
                return null;
            }
            if (root.has("Note")) {
                logger.warn("AlphaVantage Limit Reached: {}", root.get("Note").asText());
                return null;
            }

            JsonNode quote = root.get("Global Quote");
            if (quote != null && quote.has("05. price")) {
                String priceStr = quote.get("05. price").asText();
                return new BigDecimal(priceStr);
            }

        } catch (IOException e) {
            logger.error("Error fetching stock price for " + symbol, e);
        }

        return null;
    }
}
