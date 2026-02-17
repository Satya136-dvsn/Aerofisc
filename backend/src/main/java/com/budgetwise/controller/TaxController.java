/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.dto.TaxEstimateDto;
import com.budgetwise.security.UserPrincipal;
import com.budgetwise.service.TaxService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tax")
public class TaxController {

    private final TaxService taxService;

    public TaxController(TaxService taxService) {
        this.taxService = taxService;
    }

    @GetMapping("/estimate")
    public ResponseEntity<TaxEstimateDto> getTaxEstimate(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        TaxEstimateDto estimate = taxService.calculateTaxEstimate(userPrincipal.getId());
        return ResponseEntity.ok(estimate);
    }
}
