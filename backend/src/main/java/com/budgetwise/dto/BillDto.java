/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import com.budgetwise.entity.Bill;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BillDto {

    private Long id;

    @NotBlank(message = "Bill name is required")
    private String name;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String category;

    @NotNull(message = "Recurrence type is required")
    private Bill.RecurrenceType recurrence;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private LocalDate nextDueDate;

    private Bill.BillStatus status;

    private Boolean autoReminder;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Calculated field for UI
    private Integer daysUntilDue;

    public BillDto() {
    }

    public BillDto(Long id, String name, BigDecimal amount, String category, Bill.RecurrenceType recurrence,
            LocalDate dueDate, LocalDate nextDueDate, Bill.BillStatus status, Boolean autoReminder, String notes,
            LocalDateTime createdAt, LocalDateTime updatedAt, Integer daysUntilDue) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.category = category;
        this.recurrence = recurrence;
        this.dueDate = dueDate;
        this.nextDueDate = nextDueDate;
        this.status = status;
        this.autoReminder = autoReminder;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.daysUntilDue = daysUntilDue;
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

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Bill.RecurrenceType getRecurrence() {
        return recurrence;
    }

    public void setRecurrence(Bill.RecurrenceType recurrence) {
        this.recurrence = recurrence;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getNextDueDate() {
        return nextDueDate;
    }

    public void setNextDueDate(LocalDate nextDueDate) {
        this.nextDueDate = nextDueDate;
    }

    public Bill.BillStatus getStatus() {
        return status;
    }

    public void setStatus(Bill.BillStatus status) {
        this.status = status;
    }

    public Boolean getAutoReminder() {
        return autoReminder;
    }

    public void setAutoReminder(Boolean autoReminder) {
        this.autoReminder = autoReminder;
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

    public Integer getDaysUntilDue() {
        return daysUntilDue;
    }

    public void setDaysUntilDue(Integer daysUntilDue) {
        this.daysUntilDue = daysUntilDue;
    }

    public static BillDtoBuilder builder() {
        return new BillDtoBuilder();
    }

    public static class BillDtoBuilder {
        private Long id;
        private String name;
        private BigDecimal amount;
        private String category;
        private Bill.RecurrenceType recurrence;
        private LocalDate dueDate;
        private LocalDate nextDueDate;
        private Bill.BillStatus status;
        private Boolean autoReminder;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Integer daysUntilDue;

        public BillDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BillDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public BillDtoBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public BillDtoBuilder category(String category) {
            this.category = category;
            return this;
        }

        public BillDtoBuilder recurrence(Bill.RecurrenceType recurrence) {
            this.recurrence = recurrence;
            return this;
        }

        public BillDtoBuilder dueDate(LocalDate dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public BillDtoBuilder nextDueDate(LocalDate nextDueDate) {
            this.nextDueDate = nextDueDate;
            return this;
        }

        public BillDtoBuilder status(Bill.BillStatus status) {
            this.status = status;
            return this;
        }

        public BillDtoBuilder autoReminder(Boolean autoReminder) {
            this.autoReminder = autoReminder;
            return this;
        }

        public BillDtoBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public BillDtoBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public BillDtoBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public BillDtoBuilder daysUntilDue(Integer daysUntilDue) {
            this.daysUntilDue = daysUntilDue;
            return this;
        }

        public BillDto build() {
            return new BillDto(id, name, amount, category, recurrence, dueDate, nextDueDate, status, autoReminder,
                    notes, createdAt, updatedAt, daysUntilDue);
        }
    }
}
