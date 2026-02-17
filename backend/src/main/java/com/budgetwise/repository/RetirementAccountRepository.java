/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.repository;

import com.budgetwise.entity.RetirementAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface RetirementAccountRepository extends JpaRepository<RetirementAccount, Long> {

    List<RetirementAccount> findByUserId(Long userId);

    Optional<RetirementAccount> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT SUM(r.balance) FROM RetirementAccount r WHERE r.userId = :userId")
    BigDecimal getTotalRetirementBalanceByUserId(Long userId);
}
