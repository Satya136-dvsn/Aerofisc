/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.dto.RetirementDto;
import com.budgetwise.security.UserPrincipal;
import com.budgetwise.service.RetirementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/retirement")
public class RetirementController {

    private final RetirementService retirementService;

    public RetirementController(RetirementService retirementService) {
        this.retirementService = retirementService;
    }

    @PostMapping
    public ResponseEntity<RetirementDto> createAccount(
            @Valid @RequestBody RetirementDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        RetirementDto created = retirementService.createAccount(dto, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<RetirementDto>> getAllAccounts(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<RetirementDto> accounts = retirementService.getAllAccounts(userPrincipal.getId());
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RetirementDto> getAccountById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        RetirementDto account = retirementService.getAccountById(id, userPrincipal.getId());
        return ResponseEntity.ok(account);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RetirementDto> updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody RetirementDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        RetirementDto updated = retirementService.updateAccount(id, dto, userPrincipal.getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        retirementService.deleteAccount(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/projection")
    public ResponseEntity<Map<String, Object>> getProjection(
            @RequestParam(defaultValue = "30") int years,
            @RequestParam(defaultValue = "0.07") double returnRate,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BigDecimal projection = retirementService.calculateProjection(
                userPrincipal.getId(), years, returnRate);
        return ResponseEntity.ok(Map.of(
                "years", years,
                "returnRate", returnRate,
                "projectedBalance", projection));
    }
}
