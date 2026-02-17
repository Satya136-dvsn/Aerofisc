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
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaxEstimateDto {
    private BigDecimal totalIncome;
    private BigDecimal totalDeductions;
    private BigDecimal taxableIncome;
    private BigDecimal estimatedTax;
    private String taxBracket;
    private BigDecimal effectiveRate;
    private Map<String, BigDecimal> deductionBreakdown;
}
