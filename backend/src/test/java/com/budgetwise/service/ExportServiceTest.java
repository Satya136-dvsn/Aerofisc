/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.PredictionDto;
import com.budgetwise.entity.Budget;
import com.budgetwise.entity.SavingsGoal;
import com.budgetwise.entity.Transaction;
import com.budgetwise.repository.BudgetRepository;
import com.budgetwise.repository.SavingsGoalRepository;
import com.budgetwise.repository.TransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class ExportServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private SavingsGoalRepository savingsGoalRepository;

    @Mock
    private PdfReportGenerator pdfReportGenerator;

    @Mock
    private ExcelReportGenerator excelReportGenerator;

    @Mock
    private PredictionService predictionService;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private ObjectWriter objectWriter;

    private ExportService exportService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        exportService = new ExportService(transactionRepository, budgetRepository, savingsGoalRepository,
                pdfReportGenerator, excelReportGenerator, predictionService, objectMapper);
    }

    @Test
    void exportAllDataJSON_ShouldReturnByteArray() throws IOException {
        // Arrange
        Long userId = 1L;
        when(transactionRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(Collections.emptyList());
        when(budgetRepository.findByUserId(userId)).thenReturn(Collections.emptyList());
        when(savingsGoalRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

        when(objectMapper.writerWithDefaultPrettyPrinter()).thenReturn(objectWriter);
        when(objectWriter.writeValueAsBytes(anyMap())).thenReturn(new byte[] { 1, 2, 3 });

        // Act
        byte[] result = exportService.exportAllDataJSON(userId);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);
        verify(transactionRepository).findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    void exportDashboardPDF_ShouldReturnByteArray() {
        // Arrange
        Long userId = 1L;
        when(transactionRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(Collections.emptyList());
        when(budgetRepository.findByUserId(userId)).thenReturn(Collections.emptyList());
        when(savingsGoalRepository.findByUserId(userId)).thenReturn(Collections.emptyList());
        when(pdfReportGenerator.generateDashboardPdf(anyLong(), anyList(), anyList(), anyList()))
                .thenReturn(new byte[] { 1, 2, 3 });

        // Act
        byte[] result = exportService.exportDashboardPDF(userId);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);
        verify(pdfReportGenerator).generateDashboardPdf(eq(userId), anyList(), anyList(), anyList());
    }

    @Test
    void exportAnalyticsPDF_ShouldReturnByteArray() {
        // Arrange
        Long userId = 1L;
        String timeRange = "6M";
        when(transactionRepository.findByUserIdAndTransactionDateBetween(anyLong(), any(LocalDate.class),
                any(LocalDate.class)))
                .thenReturn(Collections.emptyList());
        when(predictionService.predictNextMonthExpenses(userId)).thenReturn(Collections.emptyList());
        when(pdfReportGenerator.generateAnalyticsPdf(anyLong(), anyList(), anyString(), anyList()))
                .thenReturn(new byte[] { 1, 2, 3 });

        // Act
        byte[] result = exportService.exportAnalyticsPDF(userId, timeRange);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);
        verify(pdfReportGenerator).generateAnalyticsPdf(eq(userId), anyList(), eq(timeRange), anyList());
    }
}
