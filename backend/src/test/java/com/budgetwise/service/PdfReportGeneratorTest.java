/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.CategoryBreakdownDto;
import com.budgetwise.dto.MonthlyTrendDto;
import com.budgetwise.dto.PredictionDto;
import com.budgetwise.entity.Budget;
import com.budgetwise.entity.SavingsGoal;
import com.budgetwise.entity.Transaction;
import com.budgetwise.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.awt.image.BufferedImage;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

public class PdfReportGeneratorTest {

    @Mock
    private ChartGeneratorService chartGenerator;

    @Mock
    private DashboardService dashboardService;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private PdfReportGenerator pdfReportGenerator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void generateDashboardPdf_ShouldReturnByteArray() {
        // Arrange
        Long userId = 1L;
        Transaction t1 = new Transaction();
        t1.setAmount(new BigDecimal("100.00"));
        t1.setTransactionDate(LocalDate.now());
        t1.setType(Transaction.TransactionType.EXPENSE);
        List<Transaction> transactions = Collections.singletonList(t1);
        List<Budget> budgets = Collections.emptyList();
        List<SavingsGoal> goals = Collections.emptyList();

        MonthlyTrendDto trend = MonthlyTrendDto.builder()
                .month("Jan")
                .income(new BigDecimal("5000"))
                .expenses(new BigDecimal("2000"))
                .netSavings(new BigDecimal("3000"))
                .build();
        when(dashboardService.getMonthlyTrends(anyLong(), anyInt())).thenReturn(Collections.singletonList(trend));

        CategoryBreakdownDto breakdown = CategoryBreakdownDto.builder()
                .categoryId(1L)
                .categoryName("Food")
                .amount(new BigDecimal("1000"))
                .percentage(20.0)
                .transactionCount(5)
                .build();
        when(dashboardService.getCategoryBreakdown(anyLong(), anyInt()))
                .thenReturn(Collections.singletonList(breakdown));

        BufferedImage mockImage = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);
        when(chartGenerator.generateTrendChart(anyList(), anyInt(), anyInt())).thenReturn(mockImage);
        when(chartGenerator.generateCategoryPieChart(anyList(), anyInt(), anyInt())).thenReturn(mockImage);

        // Act
        byte[] pdfBytes = pdfReportGenerator.generateDashboardPdf(userId, transactions, budgets, goals);

        // Assert
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }

    @Test
    void generateAnalyticsPdf_ShouldReturnByteArray() {
        // Arrange
        Long userId = 1L;
        Transaction t1 = new Transaction();
        t1.setAmount(new BigDecimal("100.00"));
        t1.setTransactionDate(LocalDate.now());
        t1.setType(Transaction.TransactionType.EXPENSE);
        List<Transaction> transactions = Collections.singletonList(t1);
        List<PredictionDto> predictions = Collections.emptyList();

        MonthlyTrendDto trend = MonthlyTrendDto.builder()
                .month("Jan")
                .income(new BigDecimal("5000"))
                .expenses(new BigDecimal("2000"))
                .netSavings(new BigDecimal("3000"))
                .build();
        when(dashboardService.getMonthlyTrends(anyLong(), anyInt())).thenReturn(Collections.singletonList(trend));

        CategoryBreakdownDto breakdown = CategoryBreakdownDto.builder()
                .categoryId(1L)
                .categoryName("Food")
                .amount(new BigDecimal("1000"))
                .percentage(20.0)
                .transactionCount(5)
                .build();
        when(dashboardService.getCategoryBreakdown(anyLong(), anyInt()))
                .thenReturn(Collections.singletonList(breakdown));

        BufferedImage mockImage = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);
        when(chartGenerator.generateTrendChart(anyList(), anyInt(), anyInt())).thenReturn(mockImage);
        when(chartGenerator.generateCategoryPieChart(anyList(), anyInt(), anyInt())).thenReturn(mockImage);

        // Act
        byte[] pdfBytes = pdfReportGenerator.generateAnalyticsPdf(userId, transactions, "6M", predictions);

        // Assert
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }
}
