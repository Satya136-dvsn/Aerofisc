/*
 * Â© 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.aerofisc.repository;

import com.aerofisc.entity.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {

    List<Investment> findByUserIdOrderByPurchaseDateDesc(Long userId);

    List<Investment> findByUserIdAndType(Long userId, Investment.InvestmentType type);

    void deleteByUserId(Long userId);

    Optional<Investment> findByIdAndUserId(Long id, Long userId);
}


