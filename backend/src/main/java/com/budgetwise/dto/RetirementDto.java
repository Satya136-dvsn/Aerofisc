/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import com.budgetwise.entity.RetirementAccount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RetirementDto {
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private RetirementAccount.AccountType accountType;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal balance;

    private BigDecimal contributionAmount;
    private BigDecimal employerMatch;

    // Calculated fields
    private BigDecimal projectedBalance;
    private Integer yearsToRetirement;
}
