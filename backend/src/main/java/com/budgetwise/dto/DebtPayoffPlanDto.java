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
public class DebtPayoffPlanDto {

    private String strategy; // AVALANCHE or SNOWBALL
    private List<DebtPayoffStep> steps;
    private Integer totalMonths;
    private BigDecimal totalInterestPaid;
    private BigDecimal monthlySurplus; // Extra payment beyond minimums

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DebtPayoffStep {
        private Long debtId;
        private String debtName;
        private Integer payoffMonth;
        private BigDecimal totalPaid;
        private BigDecimal interestPaid;
    }
}
