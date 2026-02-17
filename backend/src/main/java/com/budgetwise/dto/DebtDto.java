/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import com.budgetwise.entity.Debt;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebtDto {

    private Long id;

    @NotBlank(message = "Debt name is required")
    private String name;

    @NotNull(message = "Debt type is required")
    private Debt.DebtType type;

    @NotNull(message = "Principal amount is required")
    @DecimalMin(value = "0.01", message = "Principal must be greater than 0")
    private BigDecimal principal;

    @NotNull(message = "Current balance is required")
    @DecimalMin(value = "0.00", message = "Current balance must be 0 or greater")
    private BigDecimal currentBalance;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.00", message = "Interest rate must be 0 or greater")
    @DecimalMax(value = "100.00", message = "Interest rate must be 100 or less")
    private BigDecimal interestRate;

    @NotNull(message = "Minimum payment is required")
    @DecimalMin(value = "0.01", message = "Minimum payment must be greater than 0")
    private BigDecimal minimumPayment;

    private LocalDate dueDate;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Calculated fields
    private BigDecimal monthlyInterest;
    private Integer monthsToPayoff;
    private BigDecimal totalInterestPaid;
}
