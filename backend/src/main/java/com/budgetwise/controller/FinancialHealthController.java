/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.dto.FinancialHealthDto;
import com.budgetwise.security.UserPrincipal;
import com.budgetwise.service.FinancialHealthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/financial-health")
public class FinancialHealthController {

    private final FinancialHealthService financialHealthService;

    public FinancialHealthController(FinancialHealthService financialHealthService) {
        this.financialHealthService = financialHealthService;
    }

    @GetMapping("/score")
    public ResponseEntity<FinancialHealthDto> getHealthScore(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        FinancialHealthDto health = financialHealthService.calculateHealthScore(userPrincipal.getId());
        return ResponseEntity.ok(health);
    }
}
