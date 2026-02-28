/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.Aerofisc.service;

import com.Aerofisc.dto.DashboardSummaryDto;
import com.Aerofisc.dto.MonthlyTrendDto;
import com.Aerofisc.dto.CategoryBreakdownDto;
import com.Aerofisc.dto.TransactionDto;
import com.Aerofisc.entity.Transaction;
import com.Aerofisc.repository.BudgetRepository;
import com.Aerofisc.repository.SavingsGoalRepository;
import com.Aerofisc.repository.TransactionRepository;
import com.Aerofisc.service.PredictionService;
import com.Aerofisc.dto.PredictionDto;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

        private final TransactionRepository transactionRepository;
        private final BudgetRepository budgetRepository;
        private final SavingsGoalRepository savingsGoalRepository;
        private final com.Aerofisc.repository.CategoryRepository categoryRepository;
        private final PredictionService predictionService;

        public DashboardService(TransactionRepository transactionRepository, BudgetRepository budgetRepository,
                        SavingsGoalRepository savingsGoalRepository,
                        com.Aerofisc.repository.CategoryRepository categoryRepository,
                        PredictionService predictionService) {
                this.transactionRepository = transactionRepository;
                this.budgetRepository = budgetRepository;
                this.savingsGoalRepository = savingsGoalRepository;
                this.categoryRepository = categoryRepository;
                this.predictionService = predictionService;
        }

        @Cacheable(value = "dashboard_summary", key = "#userId")
        public DashboardSummaryDto getDashboardSummary(Long userId) {

                List<Transaction> allTransactions = transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);

                // Calculate Balance (All Time)
                BigDecimal allTimeIncome = allTransactions.stream()
                                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                                .map(Transaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal allTimeExpenses = allTransactions.stream()
                                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                                .map(Transaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal balance = allTimeIncome.subtract(allTimeExpenses);

                // Calculate Income/Expense (Current Month Only)
                YearMonth currentMonth = YearMonth.now();
                List<Transaction> currentMonthTransactions = allTransactions.stream()
                                .filter(t -> {
                                        LocalDate date = t.getTransactionDate();
                                        return date != null && YearMonth.from(date).equals(currentMonth);
                                })
                                .collect(Collectors.toList());

                BigDecimal monthlyIncome = currentMonthTransactions.stream()
                                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                                .map(Transaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal monthlyExpenses = currentMonthTransactions.stream()
                                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                                .map(Transaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                Double savingsRate = monthlyIncome.compareTo(BigDecimal.ZERO) > 0
                                ? monthlyIncome.subtract(monthlyExpenses).divide(monthlyIncome, 4, RoundingMode.HALF_UP)
                                                .multiply(BigDecimal.valueOf(100))
                                                .doubleValue()
                                : 0.0;

                Integer budgetCount = budgetRepository.countByUserId(userId);
                Integer totalGoals = savingsGoalRepository.countByUserId(userId);

                // Get AI Prediction for Next Month
                BigDecimal nextMonthPrediction = BigDecimal.ZERO;
                String aiRecommendation = "Keep up the good work!";

                try {
                        List<PredictionDto> predictions = predictionService.predictNextMonthExpenses(userId);
                        if (!predictions.isEmpty()) {
                                // Index 0 is the total prediction
                                nextMonthPrediction = predictions.get(0).getPredictedAmount();

                                // Generate Recommendation
                                PredictionDto topConcern = null;
                                for (int i = 1; i < predictions.size(); i++) { // Skip total at index 0
                                        PredictionDto p = predictions.get(i);
                                        String catName = p.getCategoryName().toLowerCase();
                                        // Filter out non-expense categories or positive financial habits
                                        if (catName.contains("saving") || catName.contains("investment")
                                                        || catName.contains("income")) {
                                                continue;
                                        }

                                        if ("INCREASING".equals(p.getTrend())) {
                                                if (topConcern == null || p.getPredictedAmount()
                                                                .compareTo(topConcern.getPredictedAmount()) > 0) {
                                                        topConcern = p;
                                                }
                                        }
                                }

                                if (topConcern == null && predictions.size() > 1) {
                                        // Fallback: Find highest predicted expense that isn't savings/investment
                                        for (int i = 1; i < predictions.size(); i++) {
                                                PredictionDto p = predictions.get(i);
                                                String catName = p.getCategoryName().toLowerCase();
                                                if (catName.contains("saving") || catName.contains("investment")
                                                                || catName.contains("income")) {
                                                        continue;
                                                }

                                                if (topConcern == null || p.getPredictedAmount()
                                                                .compareTo(topConcern.getPredictedAmount()) > 0) {
                                                        topConcern = p;
                                                }
                                        }
                                }

                                if (topConcern != null) {
                                        if ("INCREASING".equals(topConcern.getTrend())) {
                                                aiRecommendation = "Alert: Spending on " + topConcern.getCategoryName()
                                                                + " is trending up. Try to reduce it.";
                                        } else {
                                                aiRecommendation = "Tip: Your highest projected expense is "
                                                                + topConcern.getCategoryName()
                                                                + ". Look for savings here.";
                                        }
                                }
                        }
                } catch (Throwable e) {
                        System.err.println(
                                        "CRITICAL ERROR: Failed to get AI prediction for dashboard: " + e.getMessage());
                        e.printStackTrace();
                }

                return DashboardSummaryDto.builder()
                                .totalIncome(monthlyIncome)
                                .totalExpenses(monthlyExpenses)
                                .balance(balance)
                                .savingsRate(savingsRate)
                                .transactionCount(allTransactions.size())
                                .budgetCount(budgetCount)
                                .goalCount(totalGoals)
                                .nextMonthPrediction(nextMonthPrediction)
                                .aiRecommendation(aiRecommendation)
                                .build();
        }

        @Cacheable(value = "dashboard_trends", key = "#userId + '_' + #months")
        public List<MonthlyTrendDto> getMonthlyTrends(Long userId, Integer months) {
                if (months == null || months <= 0) {
                        months = 6;
                }

                List<MonthlyTrendDto> trends = new ArrayList<>();
                LocalDate endDate = LocalDate.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

                for (int i = months - 1; i >= 0; i--) {
                        YearMonth yearMonth = YearMonth.from(endDate.minusMonths(i));
                        LocalDate startOfMonth = yearMonth.atDay(1);
                        LocalDate endOfMonth = yearMonth.atEndOfMonth();

                        List<Transaction> transactions = transactionRepository.findByUserIdAndTransactionDateBetween(
                                        userId, startOfMonth, endOfMonth);

                        BigDecimal income = transactions.stream()
                                        .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                                        .map(Transaction::getAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        BigDecimal expenses = transactions.stream()
                                        .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                                        .map(Transaction::getAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        trends.add(MonthlyTrendDto.builder()
                                        .month(startOfMonth.format(formatter))
                                        .income(income)
                                        .expenses(expenses)
                                        .netSavings(income.subtract(expenses))
                                        .build());
                }

                return trends;
        }

        @Cacheable(value = "dashboard_breakdown", key = "#userId + '_' + #months")
        public List<CategoryBreakdownDto> getCategoryBreakdown(Long userId, Integer months) {
                if (months == null || months <= 0) {
                        months = 6;
                }

                LocalDate endDate = LocalDate.now();
                LocalDate startDate = endDate.minusMonths(months).withDayOfMonth(1);

                List<Transaction> transactions = transactionRepository.findByUserIdAndTransactionDateBetween(
                                userId, startDate, endDate);

                // Filter only expenses for category breakdown
                List<Transaction> expenses = transactions.stream()
                                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                                .collect(Collectors.toList());

                BigDecimal totalExpenses = expenses.stream()
                                .map(Transaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Group by category
                Map<Long, List<Transaction>> groupedByCategory = expenses.stream()
                                .filter(t -> t.getCategoryId() != null)
                                .collect(Collectors.groupingBy(Transaction::getCategoryId));

                // Fetch all categories for name mapping
                Map<Long, String> categoryNames = categoryRepository.findAll().stream()
                                .collect(Collectors.toMap(com.Aerofisc.entity.Category::getId,
                                                com.Aerofisc.entity.Category::getName));

                List<CategoryBreakdownDto> breakdown = new ArrayList<>();

                groupedByCategory.forEach((categoryId, categoryTransactions) -> {
                        BigDecimal categoryAmount = categoryTransactions.stream()
                                        .map(Transaction::getAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        Double percentage = totalExpenses.compareTo(BigDecimal.ZERO) > 0
                                        ? categoryAmount.divide(totalExpenses, 4, RoundingMode.HALF_UP)
                                                        .multiply(BigDecimal.valueOf(100))
                                                        .doubleValue()
                                        : 0.0;

                        // Fetch category name from map or default
                        String categoryName = categoryNames.getOrDefault(categoryId, "Category " + categoryId);

                        breakdown.add(CategoryBreakdownDto.builder()
                                        .categoryId(categoryId)
                                        .categoryName(categoryName)
                                        .amount(categoryAmount)
                                        .percentage(percentage)
                                        .transactionCount(categoryTransactions.size())
                                        .build());
                });

                // Sort by amount descending
                breakdown.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));

                return breakdown;
        }

        public List<TransactionDto> getRecentTransactions(Long userId, Integer limit) {
                if (limit == null || limit <= 0) {
                        limit = 10;
                }

                List<Transaction> transactions = transactionRepository
                                .findTop10ByUserIdOrderByTransactionDateDescCreatedAtDesc(userId);

                return transactions.stream()
                                .limit(limit)
                                .map(this::convertToDto)
                                .collect(Collectors.toList());
        }

        private TransactionDto convertToDto(Transaction transaction) {
                return TransactionDto.builder()
                                .id(transaction.getId())
                                .amount(transaction.getAmount())
                                .type(transaction.getType())
                                .categoryId(transaction.getCategoryId())
                                .categoryName("Category") // In production, fetch from category service
                                .description(transaction.getDescription())
                                .transactionDate(transaction.getTransactionDate())
                                .createdAt(transaction.getCreatedAt())
                                .build();
        }
}

