/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

public class CategorizationSuggestionDto {
    private Long categoryId;
    private String categoryName;
    private Double confidence;
    private String reason;

    public CategorizationSuggestionDto() {
    }

    public CategorizationSuggestionDto(Long categoryId, String categoryName, Double confidence, String reason) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.confidence = confidence;
        this.reason = reason;
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

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public static CategorizationSuggestionDtoBuilder builder() {
        return new CategorizationSuggestionDtoBuilder();
    }

    public static class CategorizationSuggestionDtoBuilder {
        private Long categoryId;
        private String categoryName;
        private Double confidence;
        private String reason;

        public CategorizationSuggestionDtoBuilder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public CategorizationSuggestionDtoBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public CategorizationSuggestionDtoBuilder confidence(Double confidence) {
            this.confidence = confidence;
            return this;
        }

        public CategorizationSuggestionDtoBuilder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public CategorizationSuggestionDto build() {
            return new CategorizationSuggestionDto(categoryId, categoryName, confidence, reason);
        }
    }
}
