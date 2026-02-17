/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.ContributionRequest;
import com.budgetwise.dto.SavingsGoalDto;
import com.budgetwise.entity.SavingsGoal;
import com.budgetwise.entity.Transaction;
import com.budgetwise.exception.ResourceNotFoundException;
import com.budgetwise.repository.SavingsGoalRepository;
import com.budgetwise.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SavingsGoalServiceTest {

    @Mock
    private SavingsGoalRepository savingsGoalRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private SavingsGoalService savingsGoalService;

    private SavingsGoalDto goalDto;
    private SavingsGoal goal;
    private Long userId = 1L;

    @BeforeEach
    void setUp() {
        goalDto = new SavingsGoalDto();
        goalDto.setName("New Car");
        goalDto.setTargetAmount(new BigDecimal("20000.00"));
        goalDto.setCurrentAmount(BigDecimal.ZERO);
        goalDto.setDeadline(LocalDate.now().plusYears(1));

        goal = new SavingsGoal();
        goal.setId(1L);
        goal.setUserId(userId);
        goal.setName("New Car");
        goal.setTargetAmount(new BigDecimal("20000.00"));
        goal.setCurrentAmount(BigDecimal.ZERO);
        goal.setDeadline(LocalDate.now().plusYears(1));
        goal.setStatus(SavingsGoal.GoalStatus.ACTIVE);
    }

    @Test
    void createGoal_Success() {
        when(savingsGoalRepository.save(any(SavingsGoal.class))).thenReturn(goal);

        SavingsGoalDto result = savingsGoalService.createGoal(goalDto, userId);

        assertNotNull(result);
        assertEquals(goalDto.getName(), result.getName());
        assertEquals(goalDto.getTargetAmount(), result.getTargetAmount());

        verify(savingsGoalRepository).save(any(SavingsGoal.class));
    }

    @Test
    void createGoal_InvalidDeadline() {
        goalDto.setDeadline(LocalDate.now().minusDays(1)); // Past date

        assertThrows(IllegalArgumentException.class, () -> {
            savingsGoalService.createGoal(goalDto, userId);
        });

        verify(savingsGoalRepository, never()).save(any(SavingsGoal.class));
    }

    @Test
    void addContribution_Success() {
        when(savingsGoalRepository.findByIdAndUserId(1L, userId)).thenReturn(Optional.of(goal));
        when(savingsGoalRepository.save(any(SavingsGoal.class))).thenReturn(goal);

        ContributionRequest request = new ContributionRequest();
        request.setAmount(new BigDecimal("1000.00"));

        SavingsGoalDto result = savingsGoalService.addContribution(1L, request, userId);

        assertNotNull(result);
        verify(savingsGoalRepository).save(any(SavingsGoal.class));
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void addContribution_Completed() {
        goal.setCurrentAmount(new BigDecimal("19000.00"));
        when(savingsGoalRepository.findByIdAndUserId(1L, userId)).thenReturn(Optional.of(goal));
        when(savingsGoalRepository.save(any(SavingsGoal.class))).thenReturn(goal);

        ContributionRequest request = new ContributionRequest();
        request.setAmount(new BigDecimal("1000.00"));

        savingsGoalService.addContribution(1L, request, userId);

        assertEquals(SavingsGoal.GoalStatus.COMPLETED, goal.getStatus());
    }

    @Test
    void deleteGoal_Success() {
        when(savingsGoalRepository.findByIdAndUserId(1L, userId)).thenReturn(Optional.of(goal));

        savingsGoalService.deleteGoal(1L, userId);

        verify(savingsGoalRepository).delete(goal);
    }
}
