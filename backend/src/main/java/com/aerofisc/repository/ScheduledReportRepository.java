/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.Aerofisc.repository;

import com.Aerofisc.entity.ScheduledReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduledReportRepository extends JpaRepository<ScheduledReport, Long> {
    List<ScheduledReport> findByUserId(Long userId);

    List<ScheduledReport> findByActiveTrue();

    void deleteByUserId(Long userId);
}

