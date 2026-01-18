package com.budgetwise.service;

import com.budgetwise.dto.RecurringTransactionDto;
import com.budgetwise.entity.Category;
import com.budgetwise.entity.RecurringTransaction;
import com.budgetwise.entity.Transaction;
import com.budgetwise.exception.ResourceNotFoundException;
import com.budgetwise.repository.CategoryRepository;
import com.budgetwise.repository.RecurringTransactionRepository;
import com.budgetwise.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecurringTransactionService {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetService budgetService;
    private final TransactionService transactionService;

    /**
     * Get all recurring transactions for a user
     */
    public List<RecurringTransactionDto> getAllForUser(Long userId) {
        return recurringTransactionRepository.findByUserIdOrderByNextOccurrenceAsc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active recurring transactions for a user
     */
    public List<RecurringTransactionDto> getActiveForUser(Long userId) {
        return recurringTransactionRepository.findByUserIdAndIsActiveTrueOrderByNextOccurrenceAsc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific recurring transaction
     */
    public RecurringTransactionDto getById(Long id, Long userId) {
        RecurringTransaction rt = recurringTransactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found"));
        return toDto(rt);
    }

    /**
     * Create a new recurring transaction
     */
    /**
     * Create a new recurring transaction
     */
    public RecurringTransactionDto create(RecurringTransactionDto dto, Long userId) {
        // Validate category exists
        categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        RecurringTransaction rt = RecurringTransaction.builder()
                .userId(userId)
                .type(dto.getType())
                .amount(dto.getAmount())
                .categoryId(dto.getCategoryId())
                .description(dto.getDescription())
                .frequency(dto.getFrequency())
                .startDate(dto.getStartDate() != null ? dto.getStartDate() : LocalDate.now())
                .endDate(dto.getEndDate())
                .nextOccurrence(dto.getStartDate() != null ? dto.getStartDate() : LocalDate.now())
                .isActive(true)
                .occurrencesProcessed(0)
                .maxOccurrences(dto.getMaxOccurrences())
                .build();

        RecurringTransaction saved = recurringTransactionRepository.save(rt);
        log.info("Created recurring transaction {} for user {}", saved.getId(), userId);

        // Check format immediate processing
        processIfDue(saved);

        return toDto(saved);
    }

    /**
     * Update an existing recurring transaction
     */
    public RecurringTransactionDto update(Long id, RecurringTransactionDto dto, Long userId) {
        RecurringTransaction rt = recurringTransactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found"));

        if (dto.getType() != null)
            rt.setType(dto.getType());
        if (dto.getAmount() != null)
            rt.setAmount(dto.getAmount());
        if (dto.getCategoryId() != null) {
            categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            rt.setCategoryId(dto.getCategoryId());
        }
        if (dto.getDescription() != null)
            rt.setDescription(dto.getDescription());
        if (dto.getFrequency() != null)
            rt.setFrequency(dto.getFrequency());
        if (dto.getEndDate() != null)
            rt.setEndDate(dto.getEndDate());
        if (dto.getIsActive() != null)
            rt.setIsActive(dto.getIsActive());
        if (dto.getMaxOccurrences() != null)
            rt.setMaxOccurrences(dto.getMaxOccurrences());

        RecurringTransaction saved = recurringTransactionRepository.save(rt);
        log.info("Updated recurring transaction {} for user {}", saved.getId(), userId);

        // Check for immediate processing
        processIfDue(saved);

        return toDto(saved);
    }

    /**
     * Toggle active status of a recurring transaction
     */
    public RecurringTransactionDto toggleActive(Long id, Long userId) {
        RecurringTransaction rt = recurringTransactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found"));

        rt.setIsActive(!rt.getIsActive());
        RecurringTransaction saved = recurringTransactionRepository.save(rt);
        log.info("Toggled recurring transaction {} to {} for user {}", id, rt.getIsActive(), userId);

        // Check for immediate processing
        processIfDue(saved);

        return toDto(saved);
    }

    /**
     * Delete a recurring transaction
     */
    public void delete(Long id, Long userId) {
        RecurringTransaction rt = recurringTransactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found"));

        recurringTransactionRepository.delete(rt);
        log.info("Deleted recurring transaction {} for user {}", id, userId);
    }

    /**
     * Process all due recurring transactions (called by scheduler)
     */
    @Transactional
    @CacheEvict(value = { "dashboard_summary", "dashboard_trends", "dashboard_breakdown" }, allEntries = true)
    public int processDueRecurringTransactions() {
        List<RecurringTransaction> dueTransactions = recurringTransactionRepository
                .findDueRecurringTransactions(LocalDate.now());

        int processed = 0;
        for (RecurringTransaction rt : dueTransactions) {
            try {
                // Create the actual transaction
                Transaction transaction = new Transaction();
                transaction.setUserId(rt.getUserId());
                transaction.setType(rt.getType() == RecurringTransaction.TransactionType.INCOME
                        ? Transaction.TransactionType.INCOME
                        : Transaction.TransactionType.EXPENSE);
                transaction.setAmount(rt.getAmount());
                transaction.setCategoryId(rt.getCategoryId());
                transaction.setDescription(rt.getDescription() != null
                        ? rt.getDescription() + " (Auto)"
                        : "Recurring Transaction (Auto)");
                transaction.setTransactionDate(rt.getNextOccurrence());
                transaction.setIsAnomaly(false);

                transactionRepository.save(transaction);

                // Update budget progress if expense
                if (rt.getType() == RecurringTransaction.TransactionType.EXPENSE) {
                    budgetService.updateBudgetProgress(rt.getUserId(), rt.getCategoryId());
                }

                // Update recurring transaction
                rt.setNextOccurrence(rt.calculateNextOccurrence());
                rt.setOccurrencesProcessed(rt.getOccurrencesProcessed() + 1);

                // Check if should deactivate
                if (rt.getEndDate() != null && rt.getNextOccurrence().isAfter(rt.getEndDate())) {
                    rt.setIsActive(false);
                }

                recurringTransactionRepository.save(rt);
                processed++;

                log.info("Processed recurring transaction {} - created transaction for user {}",
                        rt.getId(), rt.getUserId());

            } catch (Exception e) {
                log.error("Failed to process recurring transaction {}: {}", rt.getId(), e.getMessage());
            }
        }

        log.info("Processed {} recurring transactions", processed);
        return processed;
    }

    /**
     * Helper to process a single recurring transaction if it is due
     */
    private void processIfDue(RecurringTransaction rt) {
        if (rt.getIsActive() && !rt.getNextOccurrence().isAfter(LocalDate.now())) {
            log.info("Immediate processing for recurring transaction {}", rt.getId());
            try {
                // Create Transaction DTO
                com.budgetwise.dto.TransactionDto transactionDto = new com.budgetwise.dto.TransactionDto();
                transactionDto.setType(rt.getType() == RecurringTransaction.TransactionType.INCOME
                        ? com.budgetwise.entity.Transaction.TransactionType.INCOME
                        : com.budgetwise.entity.Transaction.TransactionType.EXPENSE);
                transactionDto.setAmount(rt.getAmount());
                transactionDto.setCategoryId(rt.getCategoryId());
                transactionDto.setDescription(rt.getDescription() != null
                        ? rt.getDescription() + " (Auto)"
                        : "Recurring Transaction (Auto)");
                transactionDto.setTransactionDate(rt.getNextOccurrence());

                // Use TransactionService to handle creation, cache eviction, websockets, etc.
                transactionService.createTransaction(transactionDto, rt.getUserId());

                // Update recurring transaction state
                rt.setNextOccurrence(rt.calculateNextOccurrence());
                rt.setOccurrencesProcessed(rt.getOccurrencesProcessed() + 1);

                // Check if should deactivate
                if (rt.getMaxOccurrences() != null && rt.getOccurrencesProcessed() >= rt.getMaxOccurrences()) {
                    rt.setIsActive(false);
                }
                if (rt.getEndDate() != null && rt.getNextOccurrence().isAfter(rt.getEndDate())) {
                    rt.setIsActive(false);
                }

                recurringTransactionRepository.save(rt);

            } catch (Exception e) {
                log.error("Failed to process recurring transaction {}: {}", rt.getId(), e.getMessage());
            }
        }
    }

    /**
     * Convert entity to DTO with category name
     */
    private RecurringTransactionDto toDto(RecurringTransaction entity) {
        RecurringTransactionDto dto = RecurringTransactionDto.fromEntity(entity);

        // Add category name
        categoryRepository.findById(entity.getCategoryId())
                .map(Category::getName)
                .ifPresent(dto::setCategoryName);

        return dto;
    }
}
