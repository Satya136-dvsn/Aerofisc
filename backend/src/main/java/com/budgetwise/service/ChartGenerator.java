/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.entity.Budget;
import com.budgetwise.entity.Transaction;
import org.knowm.xchart.*;
import org.knowm.xchart.style.Styler;
import org.knowm.xchart.style.PieStyler;
import org.knowm.xchart.style.CategoryStyler;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChartGenerator {

    // BudgetWise Brand Colors
    private static final Color PRIMARY_COLOR = new Color(44, 62, 80); // Deep Blue
    private static final Color ACCENT_COLOR = new Color(39, 174, 96); // Emerald Green
    private static final Color EXPENSE_COLOR = new Color(192, 57, 43); // Alizarin Red
    private static final Color BG_COLOR = Color.WHITE;

    public BufferedImage createMonthlyTrendsChart(List<Transaction> transactions) {
        // Aggregate data by month
        Map<String, Double> incomeByMonth = transactions.stream()
                .filter(t -> t.getType().toString().equals("INCOME"))
                .collect(Collectors.groupingBy(
                        t -> t.getTransactionDate().format(DateTimeFormatter.ofPattern("MMM yyyy")),
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())));

        Map<String, Double> expenseByMonth = transactions.stream()
                .filter(t -> t.getType().toString().equals("EXPENSE"))
                .collect(Collectors.groupingBy(
                        t -> t.getTransactionDate().format(DateTimeFormatter.ofPattern("MMM yyyy")),
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())));

        // Create Chart
        CategoryChart chart = new CategoryChartBuilder()
                .width(800)
                .height(400)
                .title("Monthly Income vs Expenses")
                .xAxisTitle("Month")
                .yAxisTitle("Amount")
                .theme(Styler.ChartTheme.Matlab)
                .build();

        // Customize Chart
        CategoryStyler styler = chart.getStyler();
        styler.setChartBackgroundColor(BG_COLOR);
        styler.setPlotBackgroundColor(BG_COLOR);
        styler.setLegendPosition(Styler.LegendPosition.InsideNE);
        styler.setAxisTitlesVisible(true);
        styler.setPlotGridLinesVisible(true);

        // Add Data
        // Note: XChart needs at least one data point. Handling empty lists gracefully.
        if (incomeByMonth.isEmpty() && expenseByMonth.isEmpty()) {
            chart.addSeries("No Data", java.util.Arrays.asList("No Data"), java.util.Arrays.asList(0));
        } else {
            // Sort months (simplified logic, ideally use YearMonth)
            List<String> months = incomeByMonth.keySet().stream().sorted().collect(Collectors.toList());
            if (months.isEmpty())
                months = expenseByMonth.keySet().stream().sorted().collect(Collectors.toList());

            List<Double> incomeData = months.stream().map(m -> incomeByMonth.getOrDefault(m, 0.0))
                    .collect(Collectors.toList());
            List<Double> expenseData = months.stream().map(m -> expenseByMonth.getOrDefault(m, 0.0))
                    .collect(Collectors.toList());

            chart.addSeries("Income", months, incomeData).setFillColor(ACCENT_COLOR);
            chart.addSeries("Expenses", months, expenseData).setFillColor(EXPENSE_COLOR);
        }

        return BitmapEncoder.getBufferedImage(chart);
    }

    public BufferedImage createCategoryPieChart(List<Transaction> transactions) {
        // Aggregate expenses by category
        Map<Long, Double> expensesByCategory = transactions.stream()
                .filter(t -> t.getType().toString().equals("EXPENSE"))
                .collect(Collectors.groupingBy(
                        Transaction::getCategoryId,
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())));

        // Create Chart
        PieChart chart = new PieChartBuilder()
                .width(800)
                .height(500)
                .title("Expense Breakdown by Category")
                .theme(Styler.ChartTheme.GGPlot2)
                .build();

        // Customize Chart
        PieStyler styler = chart.getStyler();
        styler.setChartBackgroundColor(BG_COLOR);
        styler.setLegendVisible(true);
        // styler.setAnnotationType(PieStyler.AnnotationType.LabelAndPercentage); //
        // Removed to fix compilation
        // styler.setAnnotationDistance(1.15); // Removed to fix compilation
        styler.setPlotContentSize(.7);

        // Add Data
        if (expensesByCategory.isEmpty()) {
            chart.addSeries("No Expenses", 1);
        } else {
            expensesByCategory.forEach((catId, amount) -> {
                String catName = (catId == null) ? "Uncategorized" : "Category " + catId; // Simplified, ideally fetch
                                                                                          // name
                chart.addSeries(catName, amount);
            });
        }

        return BitmapEncoder.getBufferedImage(chart);
    }

    public BufferedImage createBudgetBarChart(List<Budget> budgets) {
        // Create Chart
        CategoryChart chart = new CategoryChartBuilder()
                .width(800)
                .height(400)
                .title("Budget vs Spent")
                .xAxisTitle("Category")
                .yAxisTitle("Amount")
                .theme(Styler.ChartTheme.XChart)
                .build();

        // Customize Chart
        CategoryStyler styler = chart.getStyler();
        styler.setChartBackgroundColor(BG_COLOR);
        styler.setLegendPosition(Styler.LegendPosition.InsideNE);
        styler.setAvailableSpaceFill(.96);
        styler.setOverlapped(true);

        // Add Data
        if (budgets.isEmpty()) {
            chart.addSeries("No Budgets", java.util.Arrays.asList("None"), java.util.Arrays.asList(0));
        } else {
            List<String> categories = budgets.stream().map(b -> "Cat " + b.getCategoryId())
                    .collect(Collectors.toList());
            List<Double> limits = budgets.stream().map(b -> b.getAmount().doubleValue()).collect(Collectors.toList());
            List<Double> spent = budgets.stream().map(b -> b.getSpent().doubleValue()).collect(Collectors.toList());

            chart.addSeries("Limit", categories, limits).setFillColor(PRIMARY_COLOR);
            chart.addSeries("Spent", categories, spent).setFillColor(EXPENSE_COLOR);
        }

        return BitmapEncoder.getBufferedImage(chart);
    }
}
