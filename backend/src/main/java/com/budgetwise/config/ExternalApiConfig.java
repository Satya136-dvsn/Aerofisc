/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import okhttp3.OkHttpClient;

import java.time.Duration;

@Configuration
public class ExternalApiConfig {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${alphavantage.api.key:demo}")
    private String alphaVantageApiKey;

    @Value("${alphavantage.api.url:https://www.alphavantage.co/query}")
    private String alphaVantageApiUrl;

    @Value("${google.drive.client-id}")
    private String googleDriveClientId;

    @Value("${google.drive.client-secret}")
    private String googleDriveClientSecret;

    @Value("${google.drive.redirect-uri}")
    private String googleDriveRedirectUri;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
                .connectTimeout(Duration.ofSeconds(30))
                .readTimeout(Duration.ofSeconds(30))
                .writeTimeout(Duration.ofSeconds(30))
                .build();
    }

    // Getters for API keys and URLs
    public String getOpenaiApiKey() {
        return geminiApiKey;
    }

    public String getOpenaiApiUrl() {
        return geminiApiUrl;
    }

    public String getAlphaVantageApiKey() {
        return alphaVantageApiKey;
    }

    public String getAlphaVantageApiUrl() {
        return alphaVantageApiUrl;
    }

    public String getGoogleDriveClientId() {
        return googleDriveClientId;
    }

    public String getGoogleDriveClientSecret() {
        return googleDriveClientSecret;
    }

    public String getGoogleDriveRedirectUri() {
        return googleDriveRedirectUri;
    }
}
