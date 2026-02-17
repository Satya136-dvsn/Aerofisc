/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.dto.DebtDto;
import com.budgetwise.dto.DebtPayoffPlanDto;
import com.budgetwise.dto.DebtSummaryDto;
import com.budgetwise.security.UserPrincipal;
import com.budgetwise.service.DebtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/debts")
public class DebtController {

    private final DebtService debtService;

    public DebtController(DebtService debtService) {
        this.debtService = debtService;
    }

    @PostMapping
    public ResponseEntity<DebtDto> createDebt(
            @Valid @RequestBody DebtDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DebtDto created = debtService.createDebt(dto, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<DebtDto>> getAllDebts(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<DebtDto> debts = debtService.getAllDebts(userPrincipal.getId());
        return ResponseEntity.ok(debts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DebtDto> getDebtById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DebtDto debt = debtService.getDebtById(id, userPrincipal.getId());
        return ResponseEntity.ok(debt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DebtDto> updateDebt(
            @PathVariable Long id,
            @Valid @RequestBody DebtDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DebtDto updated = debtService.updateDebt(id, dto, userPrincipal.getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebt(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        debtService.deleteDebt(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<DebtSummaryDto> getDebtSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DebtSummaryDto summary = debtService.getDebtSummary(userPrincipal.getId());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/payoff-plan")
    public ResponseEntity<DebtPayoffPlanDto> getPayoffPlan(
            @RequestParam(defaultValue = "AVALANCHE") String strategy,
            @RequestParam(defaultValue = "0") BigDecimal extraPayment,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DebtPayoffPlanDto plan = debtService.calculatePayoffPlan(
                userPrincipal.getId(),
                strategy,
                extraPayment);
        return ResponseEntity.ok(plan);
    }
}
