package com.budgetwise.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;

@Column(name = "user_id", nullable = false)
private Long userId;

@Column(name = "category_id") private Long categoryId;

@Enumerated(EnumType.STRING) @Column(name = "transaction_type", nullable = false, length = 20) private TransactionType type;

@Column(nullable = false, precision = 15, scale = 2) private BigDecimal amount;

@Column(columnDefinition = "TEXT") private String description;

@Column(name = "transaction_date", nullable = false) private LocalDate transactionDate;

@Column(name = "is_anomaly") private Boolean isAnomaly=false;

@CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;

@UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;

public enum TransactionType {
    INCOME, EXPENSE

    }

    public Transaction() {
    }

    public Transaction(Long id, Long userId, Long categoryId, TransactionType type, BigDecimal amount,
            String description, LocalDate transactionDate, Boolean isAnomaly, LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.categoryId = categoryId;
        this.type = type;
        this.amount = amount;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
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
}
