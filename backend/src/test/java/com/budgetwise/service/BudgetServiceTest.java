/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.BudgetDto;
import com.budgetwise.entity.Budget;
import com.budgetwise.entity.Category;
import com.budgetwise.exception.ResourceNotFoundException;
import com.budgetwise.repository.BudgetRepository;
import com.budgetwise.repository.CategoryRepository;
import com.budgetwise.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private BudgetService budgetService;

    private BudgetDto budgetDto;
    private Budget budget;
    private Category category;
    private Long userId = 1L;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        category.setName("Food");

        budgetDto = new BudgetDto();
        budgetDto.setAmount(new BigDecimal("1000.00"));
        budgetDto.setCategoryId(1L);
        budgetDto.setPeriod(Budget.BudgetPeriod.MONTHLY);
        budgetDto.setStartDate(LocalDate.now());
        budgetDto.setEndDate(LocalDate.now().plusMonths(1));

        budget = new Budget();
        budget.setId(1L);
        budget.setUserId(userId);
        budget.setAmount(new BigDecimal("1000.00"));
        budget.setCategoryId(1L);
        budget.setPeriod(Budget.BudgetPeriod.MONTHLY);
        budget.setStartDate(LocalDate.now());
        budget.setEndDate(LocalDate.now().plusMonths(1));
        budget.setSpent(BigDecimal.ZERO);
    }

    @Test
    void createBudget_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(budgetRepository.findOverlappingBudgets(any(), any(), any(), any())).thenReturn(Collections.emptyList());
        when(budgetRepository.save(any(Budget.class))).thenReturn(budget);
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(budget));

        BudgetDto result = budgetService.createBudget(budgetDto, userId);

        assertNotNull(result);
        assertEquals(budgetDto.getAmount(), result.getAmount());

        verify(budgetRepository).save(any(Budget.class));
    }

    @Test
    void createBudget_Overlapping() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(budgetRepository.findOverlappingBudgets(any(), any(), any(), any()))
                .thenReturn(Collections.singletonList(budget));

        assertThrows(IllegalArgumentException.class, () -> {
            budgetService.createBudget(budgetDto, userId);
        });

        verify(budgetRepository, never()).save(any(Budget.class));
    }

    @Test
    void getBudgetById_Success() {
        when(budgetRepository.findByIdAndUserId(1L, userId)).thenReturn(Optional.of(budget));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        BudgetDto result = budgetService.getBudgetById(1L, userId);

        assertNotNull(result);
        assertEquals(budget.getId(), result.getId());
    }

    @Test
    void updateBudget_Success() {
        when(budgetRepository.findByIdAndUserId(1L, userId)).thenReturn(Optional.of(budget));
        when(budgetRepository.save(any(Budget.class))).thenReturn(budget);
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(budget));

        budgetDto.setAmount(new BigDecimal("2000.00"));
        BudgetDto result = budgetService.updateBudget(1L, budgetDto, userId);

        assertNotNull(result);
        verify(budgetRepository).save(any(Budget.class));
    }

    @Test
    void deleteBudget_Success() {
        when(budgetRepository.findByIdAndUserId(1L, userId)).thenReturn(Optional.of(budget));

        budgetService.deleteBudget(1L, userId);

        verify(budgetRepository).delete(budget);
    }
}
