/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.entity.Category;
import com.budgetwise.repository.CategoryRepository;
import com.budgetwise.service.GeminiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test-ai")
public class TestAIController {

    private final GeminiService geminiService;
    private final CategoryRepository categoryRepository;

    public TestAIController(GeminiService geminiService, CategoryRepository categoryRepository) {
        this.geminiService = geminiService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/ping")
    public String testAiConnection() {
        try {
            return "AI Response: " + geminiService.generateContent("Hello, are you working?");
        } catch (Exception e) {
            return "AI Error: " + e.getMessage();
        }
    }

    @GetMapping("/cleanup")
    public String cleanupBadCategories() {
        List<Category> badCategories = categoryRepository.findAll().stream()
                .filter(c -> c.getName().toLowerCase().contains("error from ai service"))
                .collect(Collectors.toList());

        if (badCategories.isEmpty()) {
            return "No bad categories found.";
        }

        categoryRepository.deleteAll(badCategories);
        return "Deleted " + badCategories.size() + " bad categories.";
    }
}
