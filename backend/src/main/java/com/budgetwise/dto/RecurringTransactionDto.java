package com.budgetwise.dto;

import com.budgetwise.entity.RecurringTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecurringTransactionDto {

    private Long id;
    private RecurringTransaction.TransactionType type;
    private BigDecimal amount;
    private Long categoryId;
    private String categoryName;
    private String description;
    private RecurringTransaction.Frequency frequency;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate nextOccurrence;
    private Boolean isActive;
    private Integer occurrencesProcessed;
    private Integer maxOccurrences;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Get human-readable frequency string
     */
    public String getFrequencyDisplay() {
        if (frequency == null)
            return "";
        switch (frequency) {
            case DAILY:
                return "Daily";
            case WEEKLY:
                return "Weekly";
            case BI_WEEKLY:
                return "Every 2 weeks";
            case MONTHLY:
                return "Monthly";
            case QUARTERLY:
                return "Quarterly";
            case YEARLY:
                return "Yearly";
            default:
                return frequency.name();
        }
    }

    /**
     * Convert entity to DTO
     */
    public static RecurringTransactionDto fromEntity(RecurringTransaction entity) {
        return RecurringTransactionDto.builder()
                .id(entity.getId())
                .type(entity.getType())
                .amount(entity.getAmount())
                .categoryId(entity.getCategoryId())
                .description(entity.getDescription())
                .frequency(entity.getFrequency())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .nextOccurrence(entity.getNextOccurrence())
                .isActive(entity.getIsActive())
                .occurrencesProcessed(entity.getOccurrencesProcessed())
                .maxOccurrences(entity.getMaxOccurrences())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
