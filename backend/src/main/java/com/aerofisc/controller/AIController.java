/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.Aerofisc.controller;

import com.Aerofisc.dto.*;
import com.Aerofisc.security.UserPrincipal;
import com.Aerofisc.service.BudgetAdvisorService;
import com.Aerofisc.service.CategorizationService;
import com.Aerofisc.service.PredictionService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final PredictionService predictionService;
    private final BudgetAdvisorService budgetAdvisorService;
    private final CategorizationService categorizationService;

    public AIController(PredictionService predictionService, BudgetAdvisorService budgetAdvisorService,
            CategorizationService categorizationService) {
        this.predictionService = predictionService;
        this.budgetAdvisorService = budgetAdvisorService;
        this.categorizationService = categorizationService;
    }

    @GetMapping("/predictions")
    public ResponseEntity<List<PredictionDto>> getPredictions(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<PredictionDto> predictions = predictionService.predictNextMonthExpenses(userPrincipal.getId());
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/advice")
    public ResponseEntity<List<BudgetAdviceDto>> getBudgetAdvice(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<BudgetAdviceDto> advice = budgetAdvisorService.getPersonalizedAdvice(userPrincipal.getId());
        return ResponseEntity.ok(advice);
    }

    @PostMapping("/categorize")
    public ResponseEntity<CategorizationSuggestionDto> categorizeTransaction(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody CategorizationRequestDto request) {
        CategorizationSuggestionDto suggestion = categorizationService.suggestCategory(
                request.getDescription(), userPrincipal.getId());
        return ResponseEntity.ok(suggestion);
    }

    @PostMapping("/categorize/learn")
    public ResponseEntity<Void> learnFromCorrection(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam String description,
            @RequestParam Long categoryId) {
        categorizationService.learnFromCorrection(description, categoryId, userPrincipal.getId());
        return ResponseEntity.ok().build();
    }
}

