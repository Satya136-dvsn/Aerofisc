/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.Aerofisc.controller;

import com.Aerofisc.dto.CategoryBreakdownDto;
import com.Aerofisc.dto.DashboardSummaryDto;
import com.Aerofisc.dto.MonthlyTrendDto;
import com.Aerofisc.dto.TransactionDto;
import com.Aerofisc.security.UserPrincipal;
import com.Aerofisc.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary(userPrincipal.getId());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/monthly-trends")
    public ResponseEntity<List<MonthlyTrendDto>> getMonthlyTrends(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false, defaultValue = "6") Integer months) {
        List<MonthlyTrendDto> trends = dashboardService.getMonthlyTrends(userPrincipal.getId(), months);
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<List<CategoryBreakdownDto>> getCategoryBreakdown(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false, defaultValue = "6") Integer months) {
        List<CategoryBreakdownDto> breakdown = dashboardService.getCategoryBreakdown(userPrincipal.getId(), months);
        return ResponseEntity.ok(breakdown);
    }

    @GetMapping("/recent-transactions")
    public ResponseEntity<List<TransactionDto>> getRecentTransactions(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false, defaultValue = "5") Integer limit) {
        List<TransactionDto> transactions = dashboardService.getRecentTransactions(userPrincipal.getId(), limit);
        return ResponseEntity.ok(transactions);
    }

}

