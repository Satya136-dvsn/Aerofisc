/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.config.ExternalApiConfig;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class AlphaVantageService {

    private static final Logger logger = LoggerFactory.getLogger(AlphaVantageService.class);

    private final ExternalApiConfig apiConfig;
    private final RestTemplate restTemplate;
    private final Gson gson = new Gson();

    public AlphaVantageService(ExternalApiConfig apiConfig, RestTemplate restTemplate) {
        this.apiConfig = apiConfig;
        this.restTemplate = restTemplate;
    }

    /**
     * Get current stock price
     */
    public BigDecimal getStockPrice(String symbol) {
        try {
            String url = String.format("%s?function=GLOBAL_QUOTE&symbol=%s&apikey=%s",
                    apiConfig.getAlphaVantageApiUrl(),
                    symbol,
                    apiConfig.getAlphaVantageApiKey());

            String response = restTemplate.getForObject(url, String.class);
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);

            if (jsonResponse.has("Global Quote")) {
                JsonObject quote = jsonResponse.getAsJsonObject("Global Quote");
                String price = quote.get("05. price").getAsString();
                return new BigDecimal(price);
            }
        } catch (Exception e) {
            logger.error("Error fetching stock price for {}", symbol, e);
        }

        return BigDecimal.ZERO;
    }

    /**
     * Get stock market data for investment tracking
     */
    public Map<String, Object> getStockData(String symbol) {
        Map<String, Object> stockData = new HashMap<>();

        try {
            String url = String.format("%s?function=GLOBAL_QUOTE&symbol=%s&apikey=%s",
                    apiConfig.getAlphaVantageApiUrl(),
                    symbol,
                    apiConfig.getAlphaVantageApiKey());

            String response = restTemplate.getForObject(url, String.class);
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);

            if (jsonResponse.has("Global Quote")) {
                JsonObject quote = jsonResponse.getAsJsonObject("Global Quote");

                stockData.put("symbol", quote.get("01. symbol").getAsString());
                stockData.put("price", new BigDecimal(quote.get("05. price").getAsString()));
                stockData.put("change", new BigDecimal(quote.get("09. change").getAsString()));
                stockData.put("changePercent", quote.get("10. change percent").getAsString());
                stockData.put("volume", quote.get("06. volume").getAsLong());
            }
        } catch (Exception e) {
            logger.error("Error fetching stock data for {}", symbol, e);
        }

        return stockData;
    }

    /**
     * Get cryptocurrency price
     */
    public BigDecimal getCryptoPrice(String symbol, String market) {
        try {
            String url = String.format("%s?function=CURRENCY_EXCHANGE_RATE&from_currency=%s&to_currency=%s&apikey=%s",
                    apiConfig.getAlphaVantageApiUrl(),
                    symbol,
                    market,
                    apiConfig.getAlphaVantageApiKey());

            String response = restTemplate.getForObject(url, String.class);
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);

            if (jsonResponse.has("Realtime Currency Exchange Rate")) {
                JsonObject exchangeRate = jsonResponse.getAsJsonObject("Realtime Currency Exchange Rate");
                String rate = exchangeRate.get("5. Exchange Rate").getAsString();
                return new BigDecimal(rate);
            }
        } catch (Exception e) {
            logger.error("Error fetching crypto price for {}", symbol, e);
        }

        return BigDecimal.ZERO;
    }
}
