/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.repository;

import com.budgetwise.entity.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {

    List<SavingsGoal> findByUserId(Long userId);

    List<SavingsGoal> findByUserIdAndStatus(Long userId, SavingsGoal.GoalStatus status);

    Optional<SavingsGoal> findByIdAndUserId(Long id, Long userId);

    Integer countByUserId(Long userId);

    void deleteByUserId(Long userId);

    @Query("SELECT SUM(sg.currentAmount) FROM SavingsGoal sg WHERE sg.userId = :userId")
    BigDecimal getTotalSavingsByUserId(@Param("userId") Long userId);
}
