/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.math.BigDecimal;

public class PredictionDto {
    private Long categoryId;
    private String categoryName;
    private BigDecimal predictedAmount;
    private BigDecimal historicalAverage;
    private Double confidenceScore;
    private String trend; // INCREASING, DECREASING, STABLE

    public PredictionDto() {
    }

    public PredictionDto(Long categoryId, String categoryName, BigDecimal predictedAmount, BigDecimal historicalAverage,
            Double confidenceScore, String trend) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.predictedAmount = predictedAmount;
        this.historicalAverage = historicalAverage;
        this.confidenceScore = confidenceScore;
        this.trend = trend;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getPredictedAmount() {
        return predictedAmount;
    }

    public void setPredictedAmount(BigDecimal predictedAmount) {
        this.predictedAmount = predictedAmount;
    }

    public BigDecimal getHistoricalAverage() {
        return historicalAverage;
    }

    public void setHistoricalAverage(BigDecimal historicalAverage) {
        this.historicalAverage = historicalAverage;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }

    public static PredictionDtoBuilder builder() {
        return new PredictionDtoBuilder();
    }

    public static class PredictionDtoBuilder {
        private Long categoryId;
        private String categoryName;
        private BigDecimal predictedAmount;
        private BigDecimal historicalAverage;
        private Double confidenceScore;
        private String trend;

        public PredictionDtoBuilder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public PredictionDtoBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public PredictionDtoBuilder predictedAmount(BigDecimal predictedAmount) {
            this.predictedAmount = predictedAmount;
            return this;
        }

        public PredictionDtoBuilder historicalAverage(BigDecimal historicalAverage) {
            this.historicalAverage = historicalAverage;
            return this;
        }

        public PredictionDtoBuilder confidenceScore(Double confidenceScore) {
            this.confidenceScore = confidenceScore;
            return this;
        }

        public PredictionDtoBuilder trend(String trend) {
            this.trend = trend;
            return this;
        }

        public PredictionDto build() {
            return new PredictionDto(categoryId, categoryName, predictedAmount, historicalAverage, confidenceScore,
                    trend);
        }
    }
}
