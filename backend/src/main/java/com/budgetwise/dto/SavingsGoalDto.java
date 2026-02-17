/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import com.budgetwise.entity.SavingsGoal;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class SavingsGoalDto {

    private Long id;

    @NotBlank(message = "Goal name is required")
    @Size(max = 255, message = "Goal name cannot exceed 255 characters")
    private String name;

    @NotNull(message = "Target amount is required")
    @DecimalMin(value = "0.01", message = "Target amount must be greater than 0")
    private BigDecimal targetAmount;

    private BigDecimal currentAmount;

    @Future(message = "Deadline must be in the future")
    private LocalDate deadline;

    private SavingsGoal.GoalStatus status;

    private BigDecimal progressPercentage;

    private BigDecimal requiredMonthlySavings;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public SavingsGoalDto() {
    }

    public SavingsGoalDto(Long id, String name, BigDecimal targetAmount, BigDecimal currentAmount, LocalDate deadline,
            SavingsGoal.GoalStatus status, BigDecimal progressPercentage, BigDecimal requiredMonthlySavings,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.targetAmount = targetAmount;
        this.currentAmount = currentAmount;
        this.deadline = deadline;
        this.status = status;
        this.progressPercentage = progressPercentage;
        this.requiredMonthlySavings = requiredMonthlySavings;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public BigDecimal getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(BigDecimal currentAmount) {
        this.currentAmount = currentAmount;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public SavingsGoal.GoalStatus getStatus() {
        return status;
    }

    public void setStatus(SavingsGoal.GoalStatus status) {
        this.status = status;
    }

    public BigDecimal getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(BigDecimal progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public BigDecimal getRequiredMonthlySavings() {
        return requiredMonthlySavings;
    }

    public void setRequiredMonthlySavings(BigDecimal requiredMonthlySavings) {
        this.requiredMonthlySavings = requiredMonthlySavings;
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
