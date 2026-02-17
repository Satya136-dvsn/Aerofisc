/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AnomalyDto {
    private Long transactionId;
    private String description;
    private BigDecimal amount;
    private String categoryName;
    private LocalDate date;
    private BigDecimal categoryAverage;
    private BigDecimal standardDeviation;
    private Double zScore;
    private String severity; // LOW, MEDIUM, HIGH
    private String reason;

    public AnomalyDto() {
    }

    public AnomalyDto(Long transactionId, String description, BigDecimal amount, String categoryName, LocalDate date,
            BigDecimal categoryAverage, BigDecimal standardDeviation, Double zScore, String severity, String reason) {
        this.transactionId = transactionId;
        this.description = description;
        this.amount = amount;
        this.categoryName = categoryName;
        this.date = date;
        this.categoryAverage = categoryAverage;
        this.standardDeviation = standardDeviation;
        this.zScore = zScore;
        this.severity = severity;
        this.reason = reason;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getCategoryAverage() {
        return categoryAverage;
    }

    public void setCategoryAverage(BigDecimal categoryAverage) {
        this.categoryAverage = categoryAverage;
    }

    public BigDecimal getStandardDeviation() {
        return standardDeviation;
    }

    public void setStandardDeviation(BigDecimal standardDeviation) {
        this.standardDeviation = standardDeviation;
    }

    public Double getZScore() {
        return zScore;
    }

    public void setZScore(Double zScore) {
        this.zScore = zScore;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public static AnomalyDtoBuilder builder() {
        return new AnomalyDtoBuilder();
    }

    public static class AnomalyDtoBuilder {
        private Long transactionId;
        private String description;
        private BigDecimal amount;
        private String categoryName;
        private LocalDate date;
        private BigDecimal categoryAverage;
        private BigDecimal standardDeviation;
        private Double zScore;
        private String severity;
        private String reason;

        public AnomalyDtoBuilder transactionId(Long transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public AnomalyDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public AnomalyDtoBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public AnomalyDtoBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public AnomalyDtoBuilder date(LocalDate date) {
            this.date = date;
            return this;
        }

        public AnomalyDtoBuilder categoryAverage(BigDecimal categoryAverage) {
            this.categoryAverage = categoryAverage;
            return this;
        }

        public AnomalyDtoBuilder standardDeviation(BigDecimal standardDeviation) {
            this.standardDeviation = standardDeviation;
            return this;
        }

        public AnomalyDtoBuilder zScore(Double zScore) {
            this.zScore = zScore;
            return this;
        }

        public AnomalyDtoBuilder severity(String severity) {
            this.severity = severity;
            return this;
        }

        public AnomalyDtoBuilder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public AnomalyDto build() {
            return new AnomalyDto(transactionId, description, amount, categoryName, date, categoryAverage,
                    standardDeviation, zScore, severity, reason);
        }
    }
}
