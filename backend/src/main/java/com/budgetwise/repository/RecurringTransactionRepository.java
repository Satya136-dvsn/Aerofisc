/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.repository;

import com.budgetwise.entity.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {

    /**
     * Find all recurring transactions for a user
     */
    List<RecurringTransaction> findByUserIdOrderByNextOccurrenceAsc(Long userId);

    /**
     * Find only active recurring transactions for a user
     */
    List<RecurringTransaction> findByUserIdAndIsActiveTrueOrderByNextOccurrenceAsc(Long userId);

    /**
     * Find a specific recurring transaction by ID and user
     */
    Optional<RecurringTransaction> findByIdAndUserId(Long id, Long userId);

    /**
     * Find all due recurring transactions (for scheduler)
     */
    @Query("SELECT r FROM RecurringTransaction r WHERE r.isActive = true " +
            "AND r.nextOccurrence <= :today " +
            "AND (r.endDate IS NULL OR r.nextOccurrence <= r.endDate) " +
            "AND (r.maxOccurrences IS NULL OR r.occurrencesProcessed < r.maxOccurrences)")
    List<RecurringTransaction> findDueRecurringTransactions(@Param("today") LocalDate today);

    /**
     * Count active recurring transactions for a user
     */
    long countByUserIdAndIsActiveTrue(Long userId);

    /**
     * Delete all recurring transactions for a user
     */
    void deleteByUserId(Long userId);
}
