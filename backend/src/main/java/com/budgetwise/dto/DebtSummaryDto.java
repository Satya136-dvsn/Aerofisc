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
public class DebtSummaryDto {

    private BigDecimal totalDebt;
    private BigDecimal totalMinimumPayment;
    private Integer numberOfDebts;
    private BigDecimal averageInterestRate;
    private Integer estimatedPayoffMonths;
    private BigDecimal totalInterestProjected;
    private List<DebtDto> debts;
}
