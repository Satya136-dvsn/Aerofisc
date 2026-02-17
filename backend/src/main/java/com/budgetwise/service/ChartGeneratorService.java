/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.CategoryBreakdownDto;
import com.budgetwise.dto.MonthlyTrendDto;
import org.knowm.xchart.*;
import org.knowm.xchart.style.PieStyler;
import org.knowm.xchart.style.Styler;
import org.knowm.xchart.style.XYStyler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for generating charts for PDF exports using XChart library
 */
@Service
public class ChartGeneratorService {

    private static final Logger logger = LoggerFactory.getLogger(ChartGeneratorService.class);

    private static final Color DARK_BACKGROUND = new Color(26, 26, 26);
    private static final Color GRID_COLOR = new Color(51, 51, 51);
    private static final Color TEXT_COLOR = new Color(255, 255, 255);
    private static final Color INCOME_COLOR = new Color(76, 175, 80); // Green
    private static final Color EXPENSE_COLOR = new Color(244, 67, 54); // Red

    /**
     * Generate a line chart showing income vs expenses trends
     */
    public BufferedImage generateTrendChart(List<MonthlyTrendDto> data, int width, int height) {
        logger.info("Generating trend chart with {} data points", data.size());

        // Prepare data for XChart
        List<String> months = new ArrayList<>();
        List<Double> incomeValues = new ArrayList<>();
        List<Double> expenseValues = new ArrayList<>();

        for (MonthlyTrendDto trend : data) {
            months.add(trend.getMonth());
            incomeValues.add(trend.getIncome().doubleValue());
            expenseValues.add(trend.getExpenses().doubleValue());
        }

        // Create chart
        XYChart chart = new XYChartBuilder()
                .width(width)
                .height(height)
                .title("Income vs Expenses Trend")
                .xAxisTitle("Month")
                .yAxisTitle("Amount (₹)")
                .build();

        // Customize style for dark theme
        XYStyler styler = chart.getStyler();
        styler.setChartBackgroundColor(DARK_BACKGROUND);
        styler.setPlotBackgroundColor(DARK_BACKGROUND);
        styler.setPlotGridLinesColor(GRID_COLOR);
        styler.setChartFontColor(TEXT_COLOR);
        styler.setAxisTickLabelsColor(TEXT_COLOR);
        styler.setLegendBackgroundColor(DARK_BACKGROUND);
        styler.setLegendBorderColor(GRID_COLOR);
        styler.setMarkerSize(8);
        styler.setLegendPosition(Styler.LegendPosition.InsideNE);

        // Add series
        chart.addSeries("Income", createXValues(months.size()), incomeValues)
                .setMarkerColor(INCOME_COLOR)
                .setLineColor(INCOME_COLOR)
                .setLineWidth(3.0f);

        chart.addSeries("Expenses", createXValues(months.size()), expenseValues)
                .setMarkerColor(EXPENSE_COLOR)
                .setLineColor(EXPENSE_COLOR)
                .setLineWidth(3.0f);

        // Convert to BufferedImage
        return BitmapEncoder.getBufferedImage(chart);
    }

    /**
     * Generate a pie chart showing category breakdown
     */
    public BufferedImage generateCategoryPieChart(List<CategoryBreakdownDto> data, int width, int height) {
        logger.info("Generating category pie chart with {} categories", data.size());

        // Create chart
        PieChart chart = new PieChartBuilder()
                .width(width)
                .height(height)
                .title("Spending by Category")
                .build();

        // Customize style for dark theme
        PieStyler styler = chart.getStyler();
        styler.setChartBackgroundColor(DARK_BACKGROUND);
        styler.setPlotBackgroundColor(DARK_BACKGROUND);
        styler.setChartFontColor(TEXT_COLOR);
        styler.setLegendBackgroundColor(DARK_BACKGROUND);
        styler.setLegendBorderColor(GRID_COLOR);
        styler.setLegendPosition(Styler.LegendPosition.OutsideE);
        styler.setPlotContentSize(0.7);
        styler.setStartAngleInDegrees(90);

        // Define colors for categories
        Color[] categoryColors = {
                new Color(244, 67, 54), // Red
                new Color(233, 30, 99), // Pink
                new Color(156, 39, 176), // Purple
                new Color(103, 58, 183), // Deep Purple
                new Color(63, 81, 181), // Indigo
                new Color(33, 150, 243), // Blue
                new Color(3, 169, 244), // Light Blue
                new Color(0, 188, 212), // Cyan
                new Color(0, 150, 136), // Teal
                new Color(76, 175, 80), // Green
                new Color(255, 235, 59), // Yellow
                new Color(255, 152, 0), // Orange
        };

        styler.setSeriesColors(categoryColors);

        // Add data
        for (CategoryBreakdownDto category : data) {
            chart.addSeries(category.getCategoryName(), category.getAmount().doubleValue());
        }

        // Convert to BufferedImage
        return BitmapEncoder.getBufferedImage(chart);
    }

    /**
     * Helper method to create X-axis values (0, 1, 2, ...)
     */
    private List<Integer> createXValues(int count) {
        List<Integer> xValues = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            xValues.add(i);
        }
        return xValues;
    }
}
