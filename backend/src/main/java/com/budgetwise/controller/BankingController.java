/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.entity.BankAccount;
import com.budgetwise.service.BankingService;
import com.budgetwise.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.budgetwise.security.UserPrincipal;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/banking")
public class BankingController {

    private final BankingService bankingService;
    private final UserService userService;

    public BankingController(BankingService bankingService, UserService userService) {
        this.bankingService = bankingService;
        this.userService = userService;
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<BankAccount>> getAccounts(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(bankingService.getAllAccounts(userPrincipal.getId()));
    }

    @PostMapping("/link")
    public ResponseEntity<BankAccount> linkAccount(@RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String bankName = request.get("bankName");
        String accountType = request.get("accountType");

        return ResponseEntity.ok(bankingService.linkAccount(userPrincipal.getId(), bankName, accountType));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unlinkAccount(@PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        bankingService.unlinkAccount(id, userPrincipal.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/sync")
    public ResponseEntity<Void> syncTransactions(@PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        bankingService.syncTransactions(id, userPrincipal.getId());
        return ResponseEntity.ok().build();
    }
}
