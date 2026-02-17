/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.math.BigDecimal;

public class DashboardSummaryDto {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal balance;
    private Double savingsRate;
    private Integer transactionCount;
    private Integer budgetCount;
    private Integer goalCount;
    private BigDecimal nextMonthPrediction;
    private String aiRecommendation;

    public DashboardSummaryDto() {
    }

    public DashboardSummaryDto(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal balance, Double savingsRate,
            Integer transactionCount, Integer budgetCount, Integer goalCount, BigDecimal nextMonthPrediction,
            String aiRecommendation) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.balance = balance;
        this.savingsRate = savingsRate;
        this.transactionCount = transactionCount;
        this.budgetCount = budgetCount;
        this.goalCount = goalCount;
        this.nextMonthPrediction = nextMonthPrediction;
        this.aiRecommendation = aiRecommendation;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Double getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(Double savingsRate) {
        this.savingsRate = savingsRate;
    }

    public Integer getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(Integer transactionCount) {
        this.transactionCount = transactionCount;
    }

    public Integer getBudgetCount() {
        return budgetCount;
    }

    public void setBudgetCount(Integer budgetCount) {
        this.budgetCount = budgetCount;
    }

    public Integer getGoalCount() {
        return goalCount;
    }

    public void setGoalCount(Integer goalCount) {
        this.goalCount = goalCount;
    }

    public BigDecimal getNextMonthPrediction() {
        return nextMonthPrediction;
    }

    public void setNextMonthPrediction(BigDecimal nextMonthPrediction) {
        this.nextMonthPrediction = nextMonthPrediction;
    }

    public String getAiRecommendation() {
        return aiRecommendation;
    }

    public void setAiRecommendation(String aiRecommendation) {
        this.aiRecommendation = aiRecommendation;
    }

    public static DashboardSummaryDtoBuilder builder() {
        return new DashboardSummaryDtoBuilder();
    }

    public static class DashboardSummaryDtoBuilder {
        private BigDecimal totalIncome;
        private BigDecimal totalExpenses;
        private BigDecimal balance;
        private Double savingsRate;
        private Integer transactionCount;
        private Integer budgetCount;
        private Integer goalCount;
        private BigDecimal nextMonthPrediction;
        private String aiRecommendation;

        public DashboardSummaryDtoBuilder totalIncome(BigDecimal totalIncome) {
            this.totalIncome = totalIncome;
            return this;
        }

        public DashboardSummaryDtoBuilder totalExpenses(BigDecimal totalExpenses) {
            this.totalExpenses = totalExpenses;
            return this;
        }

        public DashboardSummaryDtoBuilder balance(BigDecimal balance) {
            this.balance = balance;
            return this;
        }

        public DashboardSummaryDtoBuilder savingsRate(Double savingsRate) {
            this.savingsRate = savingsRate;
            return this;
        }

        public DashboardSummaryDtoBuilder transactionCount(Integer transactionCount) {
            this.transactionCount = transactionCount;
            return this;
        }

        public DashboardSummaryDtoBuilder budgetCount(Integer budgetCount) {
            this.budgetCount = budgetCount;
            return this;
        }

        public DashboardSummaryDtoBuilder goalCount(Integer goalCount) {
            this.goalCount = goalCount;
            return this;
        }

        public DashboardSummaryDtoBuilder nextMonthPrediction(BigDecimal nextMonthPrediction) {
            this.nextMonthPrediction = nextMonthPrediction;
            return this;
        }

        public DashboardSummaryDtoBuilder aiRecommendation(String aiRecommendation) {
            this.aiRecommendation = aiRecommendation;
            return this;
        }

        public DashboardSummaryDto build() {
            return new DashboardSummaryDto(totalIncome, totalExpenses, balance, savingsRate, transactionCount,
                    budgetCount, goalCount, nextMonthPrediction, aiRecommendation);
        }
    }
}
