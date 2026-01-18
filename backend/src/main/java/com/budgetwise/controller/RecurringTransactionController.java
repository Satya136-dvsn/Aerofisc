package com.budgetwise.controller;

import com.budgetwise.dto.RecurringTransactionDto;
import com.budgetwise.security.UserPrincipal;
import com.budgetwise.service.RecurringTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recurring-transactions")
@RequiredArgsConstructor
public class RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;

    /**
     * Get all recurring transactions for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<RecurringTransactionDto>> getAll(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "false") boolean activeOnly) {

        List<RecurringTransactionDto> transactions = activeOnly
                ? recurringTransactionService.getActiveForUser(userPrincipal.getId())
                : recurringTransactionService.getAllForUser(userPrincipal.getId());

        return ResponseEntity.ok(transactions);
    }

    /**
     * Get a specific recurring transaction
     */
    @GetMapping("/{id}")
    public ResponseEntity<RecurringTransactionDto> getById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {

        RecurringTransactionDto transaction = recurringTransactionService.getById(id, userPrincipal.getId());
        return ResponseEntity.ok(transaction);
    }

    /**
     * Create a new recurring transaction
     */
    @PostMapping
    public ResponseEntity<RecurringTransactionDto> create(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody RecurringTransactionDto dto) {

        RecurringTransactionDto created = recurringTransactionService.create(dto, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing recurring transaction
     */
    @PutMapping("/{id}")
    public ResponseEntity<RecurringTransactionDto> update(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @RequestBody RecurringTransactionDto dto) {

        RecurringTransactionDto updated = recurringTransactionService.update(id, dto, userPrincipal.getId());
        return ResponseEntity.ok(updated);
    }

    /**
     * Toggle active status
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<RecurringTransactionDto> toggleActive(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {

        RecurringTransactionDto updated = recurringTransactionService.toggleActive(id, userPrincipal.getId());
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a recurring transaction
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {

        recurringTransactionService.delete(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Manually trigger processing (admin/testing)
     */
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> manualProcess(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        int processed = recurringTransactionService.processDueRecurringTransactions();
        return ResponseEntity.ok(Map.of(
                "message", "Recurring transactions processed",
                "count", processed));
    }
}
