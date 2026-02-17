/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.dto.ScenarioDto;
import com.budgetwise.security.UserPrincipal;
import com.budgetwise.service.ScenarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/scenarios")
public class ScenarioController {

    private final ScenarioService scenarioService;

    public ScenarioController(ScenarioService scenarioService) {
        this.scenarioService = scenarioService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ScenarioDto> analyzeScenario(
            @RequestParam BigDecimal incomeChange,
            @RequestParam BigDecimal expenseChange,
            @RequestParam(defaultValue = "0") BigDecimal savingsChange,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ScenarioDto scenario = scenarioService.analyzeScenario(
                userPrincipal.getId(), incomeChange, expenseChange, savingsChange);
        return ResponseEntity.ok(scenario);
    }
}
