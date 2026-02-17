/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.repository;

import com.budgetwise.entity.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DebtRepository extends JpaRepository<Debt, Long> {

    List<Debt> findByUserIdOrderByInterestRateDesc(Long userId);

    Optional<Debt> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT SUM(d.currentBalance) FROM Debt d WHERE d.userId = :userId")
    BigDecimal getTotalDebtByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(d.minimumPayment) FROM Debt d WHERE d.userId = :userId")
    BigDecimal getTotalMinimumPaymentByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(d) FROM Debt d WHERE d.userId = :userId")
    Long countDebtsByUserId(@Param("userId") Long userId);
}
