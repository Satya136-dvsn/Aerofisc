/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recurring_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecurringTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type; // INCOME or EXPENSE

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private Long categoryId;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Frequency frequency;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column
    private LocalDate endDate; // null for indefinite

    @Column(nullable = false)
    private LocalDate nextOccurrence;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column
    private Integer occurrencesProcessed = 0;

    @Column
    private Integer maxOccurrences; // null for unlimited

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum TransactionType {
        INCOME, EXPENSE
    }

    public enum Frequency {
        DAILY,
        WEEKLY,
        BI_WEEKLY,
        MONTHLY,
        QUARTERLY,
        YEARLY
    }

    /**
     * Calculate the next occurrence date based on frequency
     */
    public LocalDate calculateNextOccurrence() {
        switch (frequency) {
            case DAILY:
                return nextOccurrence.plusDays(1);
            case WEEKLY:
                return nextOccurrence.plusWeeks(1);
            case BI_WEEKLY:
                return nextOccurrence.plusWeeks(2);
            case MONTHLY:
                return nextOccurrence.plusMonths(1);
            case QUARTERLY:
                return nextOccurrence.plusMonths(3);
            case YEARLY:
                return nextOccurrence.plusYears(1);
            default:
                return nextOccurrence.plusMonths(1);
        }
    }

    /**
     * Check if the recurring transaction should still run
     */
    public boolean shouldProcess() {
        if (!isActive)
            return false;
        if (endDate != null && nextOccurrence.isAfter(endDate))
            return false;
        if (maxOccurrences != null && occurrencesProcessed >= maxOccurrences)
            return false;
        return !nextOccurrence.isAfter(LocalDate.now());
    }
}
