/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.math.BigDecimal;

public class MonthlyTrendDto {
    private String month;
    private BigDecimal income;
    private BigDecimal expenses;
    private BigDecimal netSavings;

    public MonthlyTrendDto() {
    }

    public MonthlyTrendDto(String month, BigDecimal income, BigDecimal expenses, BigDecimal netSavings) {
        this.month = month;
        this.income = income;
        this.expenses = expenses;
        this.netSavings = netSavings;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpenses() {
        return expenses;
    }

    public void setExpenses(BigDecimal expenses) {
        this.expenses = expenses;
    }

    public BigDecimal getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(BigDecimal netSavings) {
        this.netSavings = netSavings;
    }

    public static MonthlyTrendDtoBuilder builder() {
        return new MonthlyTrendDtoBuilder();
    }

    public static class MonthlyTrendDtoBuilder {
        private String month;
        private BigDecimal income;
        private BigDecimal expenses;
        private BigDecimal netSavings;

        public MonthlyTrendDtoBuilder month(String month) {
            this.month = month;
            return this;
        }

        public MonthlyTrendDtoBuilder income(BigDecimal income) {
            this.income = income;
            return this;
        }

        public MonthlyTrendDtoBuilder expenses(BigDecimal expenses) {
            this.expenses = expenses;
            return this;
        }

        public MonthlyTrendDtoBuilder netSavings(BigDecimal netSavings) {
            this.netSavings = netSavings;
            return this;
        }

        public MonthlyTrendDto build() {
            return new MonthlyTrendDto(month, income, expenses, netSavings);
        }
    }
}
