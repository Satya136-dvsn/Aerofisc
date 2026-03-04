package com.Aerofisc.dto;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.Aerofisc.entity.Debt;
import com.Aerofisc.entity.RecurringTransaction;
import static org.junit.jupiter.api.Assertions.*;

public class DtoCoverageTest {

    @Test
    void testRecurringTransactionDto() {
        RecurringTransactionDto dto = RecurringTransactionDto.builder()
                .id(1L)
                .amount(new BigDecimal("100.00"))
                .description("Spotify")
                .frequency(RecurringTransaction.Frequency.MONTHLY)
                .type(RecurringTransaction.TransactionType.EXPENSE)
                .startDate(LocalDate.now())
                .nextOccurrence(LocalDate.now().plusMonths(1))
                .isActive(true)
                .build();

        RecurringTransactionDto dto2 = new RecurringTransactionDto();
        dto2.setId(dto.getId());
        dto2.setAmount(dto.getAmount());
        dto2.setDescription(dto.getDescription());
        dto2.setFrequency(dto.getFrequency());
        dto2.setType(dto.getType());
        dto2.setStartDate(dto.getStartDate());
        dto2.setNextOccurrence(dto.getNextOccurrence());
        dto2.setIsActive(dto.getIsActive());

        assertNotNull(dto.toString());
        assertEquals(dto, dto2);
        assertEquals(dto.hashCode(), dto2.hashCode());
        assertNotNull(dto.getFrequencyDisplay());
    }

    @Test
    void testDebtDto() {
        DebtDto dto = DebtDto.builder()
                .id(1L)
                .name("Car Loan")
                .type(Debt.DebtType.AUTO_LOAN)
                .principal(new BigDecimal("20000.00"))
                .currentBalance(new BigDecimal("15000.00"))
                .interestRate(new BigDecimal("4.5"))
                .minimumPayment(new BigDecimal("350.00"))
                .dueDate(LocalDate.now().plusDays(5))
                .build();

        DebtDto dto2 = new DebtDto();
        dto2.setId(dto.getId());
        dto2.setName(dto.getName());
        dto2.setType(dto.getType());
        dto2.setPrincipal(dto.getPrincipal());
        dto2.setCurrentBalance(dto.getCurrentBalance());
        dto2.setInterestRate(dto.getInterestRate());
        dto2.setMinimumPayment(dto.getMinimumPayment());
        dto2.setDueDate(dto.getDueDate());

        assertNotNull(dto.toString());
        assertEquals(dto, dto2);
        assertNotNull(dto.getId());
    }

    @Test
    void testFinancialHealthDto() {
        FinancialHealthDto dto = FinancialHealthDto.builder()
                .healthScore(85)
                .healthRating("Good")
                .savingsRate(new BigDecimal("20.0"))
                .debtToIncomeRatio(new BigDecimal("15.0"))
                .emergencyFundMonths(new BigDecimal("3.0"))
                .monthlyIncome(new BigDecimal("5000.00"))
                .monthlyExpenses(new BigDecimal("4000.00"))
                .totalDebt(new BigDecimal("10000.00"))
                .totalSavings(new BigDecimal("20000.00"))
                .build();

        FinancialHealthDto dto2 = new FinancialHealthDto();
        dto2.setHealthScore(dto.getHealthScore());
        dto2.setHealthRating(dto.getHealthRating());
        dto2.setSavingsRate(dto.getSavingsRate());
        dto2.setDebtToIncomeRatio(dto.getDebtToIncomeRatio());
        dto2.setEmergencyFundMonths(dto.getEmergencyFundMonths());
        dto2.setMonthlyIncome(dto.getMonthlyIncome());
        dto2.setMonthlyExpenses(dto.getMonthlyExpenses());
        dto2.setTotalDebt(dto.getTotalDebt());
        dto2.setTotalSavings(dto.getTotalSavings());

        assertNotNull(dto.toString());
        assertEquals(dto.getHealthScore(), dto2.getHealthScore());
    }

    @Test
    void testRetirementDto() {
        RetirementDto dto = RetirementDto.builder()
                .id(1L)
                .name("401k")
                .balance(new BigDecimal("50000"))
                .contributionAmount(new BigDecimal("1000"))
                .employerMatch(new BigDecimal("500"))
                .projectedBalance(new BigDecimal("2500000"))
                .yearsToRetirement(35)
                .build();

        RetirementDto dto2 = new RetirementDto();
        dto2.setId(dto.getId());
        dto2.setName(dto.getName());
        dto2.setBalance(dto.getBalance());
        dto2.setContributionAmount(dto.getContributionAmount());
        dto2.setEmployerMatch(dto.getEmployerMatch());
        dto2.setProjectedBalance(dto.getProjectedBalance());
        dto2.setYearsToRetirement(dto.getYearsToRetirement());

        assertNotNull(dto.toString());
        assertEquals(dto.getName(), dto2.getName());
    }
}
