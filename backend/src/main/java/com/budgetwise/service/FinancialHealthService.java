package com.budgetwise.service;

import com.budgetwise.dto.FinancialHealthDto;
import com.budgetwise.entity.Transaction;
import com.budgetwise.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinancialHealthService {

    private final TransactionRepository transactionRepository;
    private final DebtRepository debtRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final ProfileService profileService;
    private final BudgetRepository budgetRepository;

    public FinancialHealthService(
            TransactionRepository transactionRepository,
            DebtRepository debtRepository,
            SavingsGoalRepository savingsGoalRepository,
            ProfileService profileService,
            BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.debtRepository = debtRepository;
        this.savingsGoalRepository = savingsGoalRepository;
        this.profileService = profileService;
        this.budgetRepository = budgetRepository;
    }

    public FinancialHealthDto calculateHealthScore(Long userId) {
        // Get user profile for income
        var profile = profileService.getProfile(userId);
        BigDecimal monthlyIncome = profile.getMonthlyIncome() != null ? profile.getMonthlyIncome() : BigDecimal.ZERO;

        // Calculate monthly expenses (last 30 days)
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        BigDecimal monthlyExpenses = transactionRepository
                .sumExpensesByUserIdAndDateRange(userId, startDate, endDate);
        if (monthlyExpenses == null)
            monthlyExpenses = BigDecimal.ZERO;

        // Get total debt
        BigDecimal totalDebt = debtRepository.getTotalDebtByUserId(userId);
        if (totalDebt == null)
            totalDebt = BigDecimal.ZERO;

        // Calculate total savings (from savings goals)
        BigDecimal totalSavings = savingsGoalRepository.getTotalSavingsByUserId(userId);
        if (totalSavings == null)
            totalSavings = BigDecimal.ZERO;

        // Calculate metrics
        BigDecimal debtToIncomeRatio = calculateDebtToIncomeRatio(totalDebt, monthlyIncome);
        BigDecimal savingsRate = calculateSavingsRate(monthlyIncome, monthlyExpenses);
        BigDecimal emergencyFundMonths = calculateEmergencyFundMonths(totalSavings, monthlyExpenses);

        // Calculate health score (0-100)
        int healthScore = calculateOverallScore(
                debtToIncomeRatio,
                savingsRate,
                emergencyFundMonths,
                monthlyIncome,
                monthlyExpenses);

        // Determine health rating
        String healthRating = getHealthRating(healthScore);

        // Generate recommendations
        List<FinancialHealthDto.HealthRecommendation> recommendations = generateRecommendations(
                debtToIncomeRatio,
                savingsRate,
                emergencyFundMonths,
                monthlyIncome,
                monthlyExpenses,
                totalDebt);

        return FinancialHealthDto.builder()
                .healthScore(healthScore)
                .healthRating(healthRating)
                .debtToIncomeRatio(debtToIncomeRatio.setScale(2, RoundingMode.HALF_UP))
                .savingsRate(savingsRate.setScale(2, RoundingMode.HALF_UP))
                .emergencyFundMonths(emergencyFundMonths.setScale(1, RoundingMode.HALF_UP))
                .monthlyIncome(monthlyIncome.setScale(2, RoundingMode.HALF_UP))
                .monthlyExpenses(monthlyExpenses.setScale(2, RoundingMode.HALF_UP))
                .totalDebt(totalDebt.setScale(2, RoundingMode.HALF_UP))
                .totalSavings(totalSavings.setScale(2, RoundingMode.HALF_UP))
                .recommendations(recommendations)
                .build();
    }

    private BigDecimal calculateDebtToIncomeRatio(BigDecimal totalDebt, BigDecimal monthlyIncome) {
        if (monthlyIncome.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal annualIncome = monthlyIncome.multiply(BigDecimal.valueOf(12));
        return totalDebt.divide(annualIncome, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
    }

    private BigDecimal calculateSavingsRate(BigDecimal monthlyIncome, BigDecimal monthlyExpenses) {
        if (monthlyIncome.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal savings = monthlyIncome.subtract(monthlyExpenses);
        if (savings.compareTo(BigDecimal.ZERO) < 0) {
            return BigDecimal.ZERO;
        }
        return savings.divide(monthlyIncome, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
    }

    private BigDecimal calculateEmergencyFundMonths(BigDecimal totalSavings, BigDecimal monthlyExpenses) {
        if (monthlyExpenses.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return totalSavings.divide(monthlyExpenses, 2, RoundingMode.HALF_UP);
    }

    private int calculateOverallScore(
            BigDecimal debtToIncomeRatio,
            BigDecimal savingsRate,
            BigDecimal emergencyFundMonths,
            BigDecimal monthlyIncome,
            BigDecimal monthlyExpenses) {

        int score = 0;

        // Debt to Income Ratio (25 points)
        if (debtToIncomeRatio.compareTo(BigDecimal.valueOf(20)) <= 0) {
            score += 25;
        } else if (debtToIncomeRatio.compareTo(BigDecimal.valueOf(35)) <= 0) {
            score += 20;
        } else if (debtToIncomeRatio.compareTo(BigDecimal.valueOf(50)) <= 0) {
            score += 10;
        }

        // Savings Rate (25 points)
        if (savingsRate.compareTo(BigDecimal.valueOf(20)) >= 0) {
            score += 25;
        } else if (savingsRate.compareTo(BigDecimal.valueOf(10)) >= 0) {
            score += 20;
        } else if (savingsRate.compareTo(BigDecimal.valueOf(5)) >= 0) {
            score += 10;
        }

        // Emergency Fund (30 points)
        if (emergencyFundMonths.compareTo(BigDecimal.valueOf(6)) >= 0) {
            score += 30;
        } else if (emergencyFundMonths.compareTo(BigDecimal.valueOf(3)) >= 0) {
            score += 20;
        } else if (emergencyFundMonths.compareTo(BigDecimal.valueOf(1)) >= 0) {
            score += 10;
        }

        // Income vs Expenses (20 points)
        if (monthlyIncome.compareTo(BigDecimal.ZERO) > 0 && monthlyIncome.compareTo(monthlyExpenses) > 0) {
            BigDecimal surplus = monthlyIncome.subtract(monthlyExpenses);
            BigDecimal surplusPercent = surplus.divide(monthlyIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            if (surplusPercent.compareTo(BigDecimal.valueOf(20)) >= 0) {
                score += 20;
            } else if (surplusPercent.compareTo(BigDecimal.valueOf(10)) >= 0) {
                score += 15;
            } else if (surplusPercent.compareTo(BigDecimal.valueOf(5)) >= 0) {
                score += 10;
            } else {
                score += 5;
            }
        }

        return Math.max(0, Math.min(100, score));
    }

    private String getHealthRating(int score) {
        if (score >= 80)
            return "EXCELLENT";
        if (score >= 60)
            return "GOOD";
        if (score >= 40)
            return "FAIR";
        return "POOR";
    }

    private List<FinancialHealthDto.HealthRecommendation> generateRecommendations(
            BigDecimal debtToIncomeRatio,
            BigDecimal savingsRate,
            BigDecimal emergencyFundMonths,
            BigDecimal monthlyIncome,
            BigDecimal monthlyExpenses,
            BigDecimal totalDebt) {

        List<FinancialHealthDto.HealthRecommendation> recommendations = new ArrayList<>();

        // Debt recommendations
        if (debtToIncomeRatio.compareTo(BigDecimal.valueOf(35)) > 0) {
            recommendations.add(FinancialHealthDto.HealthRecommendation.builder()
                    .category("DEBT")
                    .priority("HIGH")
                    .title("High Debt-to-Income Ratio")
                    .description("Your debt is " + debtToIncomeRatio + "% of your annual income. Aim for below 35%.")
                    .actionItem("Focus on paying down high-interest debts using the Avalanche method")
                    .build());
        }

        // Savings recommendations
        if (savingsRate.compareTo(BigDecimal.valueOf(10)) < 0) {
            recommendations.add(FinancialHealthDto.HealthRecommendation.builder()
                    .category("SAVINGS")
                    .priority("HIGH")
                    .title("Low Savings Rate")
                    .description("You're saving " + savingsRate + "% of your income. Try to reach at least 10%.")
                    .actionItem("Review your budget to find areas where you can reduce expenses")
                    .build());
        }

        // Emergency fund recommendations
        if (emergencyFundMonths.compareTo(BigDecimal.valueOf(3)) < 0) {
            recommendations.add(FinancialHealthDto.HealthRecommendation.builder()
                    .category("EMERGENCY_FUND")
                    .priority(emergencyFundMonths.compareTo(BigDecimal.ONE) < 0 ? "HIGH" : "MEDIUM")
                    .title("Build Emergency Fund")
                    .description("You have " + emergencyFundMonths + " months of expenses saved. Aim for 3-6 months.")
                    .actionItem("Set up automatic transfers to your emergency fund each month")
                    .build());
        }

        // Income vs expenses
        if (monthlyExpenses.compareTo(monthlyIncome) >= 0) {
            recommendations.add(FinancialHealthDto.HealthRecommendation.builder()
                    .category("BUDGET")
                    .priority("HIGH")
                    .title("Expenses Exceed Income")
                    .description("Your monthly expenses are equal to or greater than your income.")
                    .actionItem("Create a detailed budget and cut non-essential spending immediately")
                    .build());
        }

        return recommendations;
    }
}
