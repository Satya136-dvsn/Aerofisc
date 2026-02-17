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
public class ScenarioDto {
    private String scenarioName;
    private BigDecimal adjustedIncome;
    private BigDecimal adjustedExpenses;
    private BigDecimal adjustedSavingsRate;
    private BigDecimal projectedBalance1Year;
    private BigDecimal projectedBalance5Years;
    private String impactOnGoals;
    private List<String> recommendations;
}
