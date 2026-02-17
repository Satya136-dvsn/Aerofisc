/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import com.budgetwise.entity.Transaction;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionDto {

    private Long id;

    @NotNull(message = "Transaction type is required")
    private Transaction.TransactionType type;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String categoryName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Transaction date is required")
    @PastOrPresent(message = "Transaction date cannot be in the future")
    private LocalDate transactionDate;

    private Boolean isAnomaly;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public TransactionDto() {
    }

    public TransactionDto(Long id, Transaction.TransactionType type, BigDecimal amount, Long categoryId,
            String categoryName, String description, LocalDate transactionDate, Boolean isAnomaly,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description = description;
        this.transactionDate = transactionDate;
        this.isAnomaly = isAnomaly;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Transaction.TransactionType getType() {
        return type;
    }

    public void setType(Transaction.TransactionType type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
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

    public Boolean getIsAnomaly() {
        return isAnomaly;
    }

    public void setIsAnomaly(Boolean isAnomaly) {
        this.isAnomaly = isAnomaly;
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

    public static TransactionDtoBuilder builder() {
        return new TransactionDtoBuilder();
    }

    public static class TransactionDtoBuilder {
        private Long id;
        private Transaction.TransactionType type;
        private BigDecimal amount;
        private Long categoryId;
        private String categoryName;
        private String description;
        private LocalDate transactionDate;
        private Boolean isAnomaly;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public TransactionDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TransactionDtoBuilder type(Transaction.TransactionType type) {
            this.type = type;
            return this;
        }

        public TransactionDtoBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public TransactionDtoBuilder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public TransactionDtoBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public TransactionDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TransactionDtoBuilder transactionDate(LocalDate transactionDate) {
            this.transactionDate = transactionDate;
            return this;
        }

        public TransactionDtoBuilder isAnomaly(Boolean isAnomaly) {
            this.isAnomaly = isAnomaly;
            return this;
        }

        public TransactionDtoBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public TransactionDtoBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public TransactionDto build() {
            return new TransactionDto(id, type, amount, categoryId, categoryName, description, transactionDate,
                    isAnomaly, createdAt, updatedAt);
        }
    }
}
