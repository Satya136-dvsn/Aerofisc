/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.math.BigDecimal;

public class CategoryBreakdownDto {
    private Long categoryId;
    private String categoryName;
    private BigDecimal amount;
    private Double percentage;
    private Integer transactionCount;

    public CategoryBreakdownDto() {
    }

    public CategoryBreakdownDto(Long categoryId, String categoryName, BigDecimal amount, Double percentage,
            Integer transactionCount) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.amount = amount;
        this.percentage = percentage;
        this.transactionCount = transactionCount;
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

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public Integer getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(Integer transactionCount) {
        this.transactionCount = transactionCount;
    }

    public static CategoryBreakdownDtoBuilder builder() {
        return new CategoryBreakdownDtoBuilder();
    }

    public static class CategoryBreakdownDtoBuilder {
        private Long categoryId;
        private String categoryName;
        private BigDecimal amount;
        private Double percentage;
        private Integer transactionCount;

        public CategoryBreakdownDtoBuilder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public CategoryBreakdownDtoBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public CategoryBreakdownDtoBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public CategoryBreakdownDtoBuilder percentage(Double percentage) {
            this.percentage = percentage;
            return this;
        }

        public CategoryBreakdownDtoBuilder transactionCount(Integer transactionCount) {
            this.transactionCount = transactionCount;
            return this;
        }

        public CategoryBreakdownDto build() {
            return new CategoryBreakdownDto(categoryId, categoryName, amount, percentage, transactionCount);
        }
    }
}
