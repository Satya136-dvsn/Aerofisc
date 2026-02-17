/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import com.budgetwise.entity.Investment;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class InvestmentDto {

    private Long id;

    @NotBlank(message = "Investment name is required")
    private String name;

    @NotNull(message = "Investment type is required")
    private Investment.InvestmentType type;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.00000001", message = "Quantity must be greater than 0")
    private BigDecimal quantity;

    @NotNull(message = "Buy price is required")
    @DecimalMin(value = "0.01", message = "Buy price must be greater than 0")
    private BigDecimal buyPrice;

    private BigDecimal currentPrice;

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    private String symbol;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Calculated fields for UI
    private BigDecimal totalInvested; // quantity * buyPrice
    private BigDecimal currentValue; // quantity * currentPrice
    private BigDecimal profitLoss; // currentValue - totalInvested
    private BigDecimal profitLossPercent; // (profitLoss / totalInvested) * 100

    public InvestmentDto() {
    }

    public InvestmentDto(Long id, String name, Investment.InvestmentType type, BigDecimal quantity, BigDecimal buyPrice,
            BigDecimal currentPrice, LocalDate purchaseDate, String symbol, String notes, LocalDateTime createdAt,
            LocalDateTime updatedAt, BigDecimal totalInvested, BigDecimal currentValue, BigDecimal profitLoss,
            BigDecimal profitLossPercent) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.quantity = quantity;
        this.buyPrice = buyPrice;
        this.currentPrice = currentPrice;
        this.purchaseDate = purchaseDate;
        this.symbol = symbol;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.totalInvested = totalInvested;
        this.currentValue = currentValue;
        this.profitLoss = profitLoss;
        this.profitLossPercent = profitLossPercent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Investment.InvestmentType getType() {
        return type;
    }

    public void setType(Investment.InvestmentType type) {
        this.type = type;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(BigDecimal buyPrice) {
        this.buyPrice = buyPrice;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public BigDecimal getTotalInvested() {
        return totalInvested;
    }

    public void setTotalInvested(BigDecimal totalInvested) {
        this.totalInvested = totalInvested;
    }

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
    }

    public BigDecimal getProfitLoss() {
        return profitLoss;
    }

    public void setProfitLoss(BigDecimal profitLoss) {
        this.profitLoss = profitLoss;
    }

    public BigDecimal getProfitLossPercent() {
        return profitLossPercent;
    }

    public void setProfitLossPercent(BigDecimal profitLossPercent) {
        this.profitLossPercent = profitLossPercent;
    }

    public static InvestmentDtoBuilder builder() {
        return new InvestmentDtoBuilder();
    }

    public static class InvestmentDtoBuilder {
        private Long id;
        private String name;
        private Investment.InvestmentType type;
        private BigDecimal quantity;
        private BigDecimal buyPrice;
        private BigDecimal currentPrice;
        private LocalDate purchaseDate;
        private String symbol;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private BigDecimal totalInvested;
        private BigDecimal currentValue;
        private BigDecimal profitLoss;
        private BigDecimal profitLossPercent;

        public InvestmentDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public InvestmentDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public InvestmentDtoBuilder type(Investment.InvestmentType type) {
            this.type = type;
            return this;
        }

        public InvestmentDtoBuilder quantity(BigDecimal quantity) {
            this.quantity = quantity;
            return this;
        }

        public InvestmentDtoBuilder buyPrice(BigDecimal buyPrice) {
            this.buyPrice = buyPrice;
            return this;
        }

        public InvestmentDtoBuilder currentPrice(BigDecimal currentPrice) {
            this.currentPrice = currentPrice;
            return this;
        }

        public InvestmentDtoBuilder purchaseDate(LocalDate purchaseDate) {
            this.purchaseDate = purchaseDate;
            return this;
        }

        public InvestmentDtoBuilder symbol(String symbol) {
            this.symbol = symbol;
            return this;
        }

        public InvestmentDtoBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public InvestmentDtoBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public InvestmentDtoBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public InvestmentDtoBuilder totalInvested(BigDecimal totalInvested) {
            this.totalInvested = totalInvested;
            return this;
        }

        public InvestmentDtoBuilder currentValue(BigDecimal currentValue) {
            this.currentValue = currentValue;
            return this;
        }

        public InvestmentDtoBuilder profitLoss(BigDecimal profitLoss) {
            this.profitLoss = profitLoss;
            return this;
        }

        public InvestmentDtoBuilder profitLossPercent(BigDecimal profitLossPercent) {
            this.profitLossPercent = profitLossPercent;
            return this;
        }

        public InvestmentDto build() {
            return new InvestmentDto(id, name, type, quantity, buyPrice, currentPrice, purchaseDate, symbol, notes,
                    createdAt, updatedAt, totalInvested, currentValue, profitLoss, profitLossPercent);
        }
    }
}
