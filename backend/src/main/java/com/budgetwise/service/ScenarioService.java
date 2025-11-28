package com.budgetwise.service;

import com.budgetwise.dto.ScenarioDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScenarioService {

    public ScenarioDto analyzeScenario(Long userId, BigDecimal incomeChange, BigDecimal expenseChange,
            BigDecimal savingsChange) {
        // Handle nulls
        incomeChange = incomeChange != null ? incomeChange : BigDecimal.ZERO;
        expenseChange = expenseChange != null ? expenseChange : BigDecimal.ZERO;
        savingsChange = savingsChange != null ? savingsChange : BigDecimal.ZERO;
        // Simplified scenario analysis
        BigDecimal projectedBalance1Year = calculateProjection(incomeChange, expenseChange, savingsChange, 1);
        BigDecimal projectedBalance5Years = calculateProjection(incomeChange, expenseChange, savingsChange, 5);

        List<String> recommendations = generateRecommendations(incomeChange, expenseChange);

        return ScenarioDto.builder()
                .scenarioName("Custom Scenario")
                .adjustedIncome(incomeChange)
                .adjustedExpenses(expenseChange)
                .adjustedSavingsRate(savingsChange)
                .projectedBalance1Year(projectedBalance1Year)
                .projectedBalance5Years(projectedBalance5Years)
                .impactOnGoals("Scenario analysis in progress")
                .recommendations(recommendations)
                .build();
    }

    private BigDecimal calculateProjection(BigDecimal incomeChange, BigDecimal expenseChange, BigDecimal savingsChange,
            int years) {
        BigDecimal monthlySavings = incomeChange.subtract(expenseChange);
        return monthlySavings.multiply(BigDecimal.valueOf(12 * years));
    }

    private List<String> generateRecommendations(BigDecimal incomeChange, BigDecimal expenseChange) {
        List<String> recommendations = new ArrayList<>();

        if (incomeChange.compareTo(expenseChange) < 0) {
            recommendations.add("Warrning: Expenses exceed income in this scenario");
        } else {
            recommendations.add("Positive cash flow scenario");
        }

        return recommendations;
    }
}
