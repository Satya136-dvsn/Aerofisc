/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.CategoryBreakdownDto;
import com.budgetwise.dto.MonthlyTrendDto;
import org.junit.jupiter.api.Test;

import java.awt.image.BufferedImage;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ChartGeneratorServiceTest {

    @Test
    void generateTrendChart_ShouldReturnImage() {
        ChartGeneratorService service = new ChartGeneratorService();
        // Arrange
        MonthlyTrendDto trend1 = new MonthlyTrendDto("Jan", new BigDecimal("5000"), new BigDecimal("2000"),
                new BigDecimal("3000"));
        MonthlyTrendDto trend2 = new MonthlyTrendDto("Feb", new BigDecimal("6000"), new BigDecimal("3000"),
                new BigDecimal("3000"));
        List<MonthlyTrendDto> data = Arrays.asList(trend1, trend2);

        // Act
        BufferedImage image = service.generateTrendChart(data, 800, 400);

        // Assert
        assertNotNull(image);
        assertEquals(800, image.getWidth());
        assertEquals(400, image.getHeight());
    }

    @Test
    void generateCategoryPieChart_ShouldReturnImage() {
        ChartGeneratorService service = new ChartGeneratorService();
        // Arrange
        CategoryBreakdownDto cat1 = CategoryBreakdownDto.builder()
                .categoryId(1L)
                .categoryName("Food")
                .amount(new BigDecimal("1000"))
                .percentage(50.0)
                .transactionCount(10)
                .build();

        CategoryBreakdownDto cat2 = CategoryBreakdownDto.builder()
                .categoryId(2L)
                .categoryName("Rent")
                .amount(new BigDecimal("5000"))
                .percentage(250.0)
                .transactionCount(5)
                .build();

        List<CategoryBreakdownDto> data = Arrays.asList(cat1, cat2);

        // Act
        BufferedImage image = service.generateCategoryPieChart(data, 600, 400);

        // Assert
        assertNotNull(image);
        assertEquals(600, image.getWidth());
        assertEquals(400, image.getHeight());
    }
}
