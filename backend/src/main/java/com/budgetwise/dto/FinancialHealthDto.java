/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialHealthDto {

    private Integer healthScore; // 0-100
    private String healthRating; // EXCELLENT, GOOD, FAIR, POOR
    private BigDecimal debtToIncomeRatio;
    private BigDecimal savingsRate;
    private BigDecimal emergencyFundMonths;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal totalDebt;
    private BigDecimal totalSavings;
    private List<HealthRecommendation> recommendations;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HealthRecommendation {
        private String category;
        private String priority; // HIGH, MEDIUM, LOW
        private String title;
        private String description;
        private String actionItem;
    }
}
