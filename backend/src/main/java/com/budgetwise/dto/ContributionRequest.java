/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ContributionRequest {
    private BigDecimal amount;
    private String description;
    private LocalDate transactionDate;

    public ContributionRequest() {
    }

    public ContributionRequest(BigDecimal amount, String description, LocalDate transactionDate) {
        this.amount = amount;
        this.description = description;
        this.transactionDate = transactionDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }
}
