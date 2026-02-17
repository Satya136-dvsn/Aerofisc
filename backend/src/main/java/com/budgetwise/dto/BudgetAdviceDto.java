/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.math.BigDecimal;

public class BudgetAdviceDto {
    private String category;
    private String recommendation;
    private BigDecimal currentSpending;
    private BigDecimal recommendedSpending;
    private Double percentageOfIncome;
    private String priority; // HIGH, MEDIUM, LOW
    private String actionItem;

    public BudgetAdviceDto() {
    }

    public BudgetAdviceDto(String category, String recommendation, BigDecimal currentSpending,
            BigDecimal recommendedSpending, Double percentageOfIncome, String priority, String actionItem) {
        this.category = category;
        this.recommendation = recommendation;
        this.currentSpending = currentSpending;
        this.recommendedSpending = recommendedSpending;
        this.percentageOfIncome = percentageOfIncome;
        this.priority = priority;
        this.actionItem = actionItem;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public BigDecimal getCurrentSpending() {
        return currentSpending;
    }

    public void setCurrentSpending(BigDecimal currentSpending) {
        this.currentSpending = currentSpending;
    }

    public BigDecimal getRecommendedSpending() {
        return recommendedSpending;
    }

    public void setRecommendedSpending(BigDecimal recommendedSpending) {
        this.recommendedSpending = recommendedSpending;
    }

    public Double getPercentageOfIncome() {
        return percentageOfIncome;
    }

    public void setPercentageOfIncome(Double percentageOfIncome) {
        this.percentageOfIncome = percentageOfIncome;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getActionItem() {
        return actionItem;
    }

    public void setActionItem(String actionItem) {
        this.actionItem = actionItem;
    }

    public static BudgetAdviceDtoBuilder builder() {
        return new BudgetAdviceDtoBuilder();
    }

    public static class BudgetAdviceDtoBuilder {
        private String category;
        private String recommendation;
        private BigDecimal currentSpending;
        private BigDecimal recommendedSpending;
        private Double percentageOfIncome;
        private String priority;
        private String actionItem;

        public BudgetAdviceDtoBuilder category(String category) {
            this.category = category;
            return this;
        }

        public BudgetAdviceDtoBuilder recommendation(String recommendation) {
            this.recommendation = recommendation;
            return this;
        }

        public BudgetAdviceDtoBuilder currentSpending(BigDecimal currentSpending) {
            this.currentSpending = currentSpending;
            return this;
        }

        public BudgetAdviceDtoBuilder recommendedSpending(BigDecimal recommendedSpending) {
            this.recommendedSpending = recommendedSpending;
            return this;
        }

        public BudgetAdviceDtoBuilder percentageOfIncome(Double percentageOfIncome) {
            this.percentageOfIncome = percentageOfIncome;
            return this;
        }

        public BudgetAdviceDtoBuilder priority(String priority) {
            this.priority = priority;
            return this;
        }

        public BudgetAdviceDtoBuilder actionItem(String actionItem) {
            this.actionItem = actionItem;
            return this;
        }

        public BudgetAdviceDto build() {
            return new BudgetAdviceDto(category, recommendation, currentSpending, recommendedSpending,
                    percentageOfIncome, priority, actionItem);
        }
    }
}
