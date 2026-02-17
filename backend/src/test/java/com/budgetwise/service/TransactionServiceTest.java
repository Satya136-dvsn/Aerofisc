/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.TransactionDto;
import com.budgetwise.entity.Category;
import com.budgetwise.entity.Transaction;
import com.budgetwise.exception.ResourceNotFoundException;
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
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private BudgetService budgetService;

    @Mock
    private WebSocketService webSocketService;

    @Mock
    private BillService billService;

    @InjectMocks
    private TransactionService transactionService;

    private TransactionDto transactionDto;
    private Transaction transaction;
    private Category category;
    private Long userId = 1L;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        category.setName("Food");
        category.setType(Category.CategoryType.EXPENSE);

        transactionDto = new TransactionDto();
        transactionDto.setAmount(new BigDecimal("100.00"));
        transactionDto.setCategoryId(1L);
        transactionDto.setDescription("Lunch");
        transactionDto.setType(Transaction.TransactionType.EXPENSE);
        transactionDto.setTransactionDate(LocalDate.now());

        transaction = new Transaction();
        transaction.setId(1L);
        transaction.setUserId(userId);
        transaction.setAmount(new BigDecimal("100.00"));
        transaction.setCategoryId(1L);
        transaction.setDescription("Lunch");
        transaction.setType(Transaction.TransactionType.EXPENSE);
        transaction.setTransactionDate(LocalDate.now());
        transaction.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createTransaction_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        TransactionDto result = transactionService.createTransaction(transactionDto, userId);

        assertNotNull(result);
        assertEquals(transactionDto.getAmount(), result.getAmount());
        assertEquals("Food", result.getCategoryName());

        verify(transactionRepository).save(any(Transaction.class));
        verify(budgetService).updateBudgetProgress(userId, 1L);
        verify(webSocketService).sendDashboardUpdate(userId);
    }

    @Test
    void createTransaction_CategoryNotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            transactionService.createTransaction(transactionDto, userId);
        });

        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    @Test
    void getTransactionById_Success() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        TransactionDto result = transactionService.getTransactionById(1L, userId);

        assertNotNull(result);
        assertEquals(transaction.getId(), result.getId());
    }

    @Test
    void getTransactionById_NotFound() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            transactionService.getTransactionById(1L, userId);
        });
    }

    @Test
    void getTransactionById_WrongUser() {
        transaction.setUserId(2L); // Different user
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

        assertThrows(ResourceNotFoundException.class, () -> {
            transactionService.getTransactionById(1L, userId);
        });
    }

    @Test
    void deleteTransaction_Success() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

        transactionService.deleteTransaction(1L, userId);

        verify(transactionRepository).delete(transaction);
        verify(budgetService).updateBudgetProgress(userId, 1L);
    }
}
