package com.aerofisc.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

public class EntityCoverageTest {

    @Test
    void testRecurringTransaction() {
        RecurringTransaction tx = RecurringTransaction.builder()
                .id(1L)
                .userId(1L)
                .amount(new BigDecimal("100.00"))
                .description("Netflix")
                .categoryId(2L)
                .frequency(RecurringTransaction.Frequency.MONTHLY)
                .type(RecurringTransaction.TransactionType.EXPENSE)
                .startDate(LocalDate.now())
                .nextOccurrence(LocalDate.now().minusDays(1))
                .isActive(true)
                .occurrencesProcessed(0)
                .createdAt(LocalDateTime.now())
                .build();

        RecurringTransaction tx2 = new RecurringTransaction();
        tx2.setId(tx.getId());
        tx2.setUserId(tx.getUserId());
        tx2.setAmount(tx.getAmount());
        tx2.setDescription(tx.getDescription());
        tx2.setCategoryId(tx.getCategoryId());
        tx2.setFrequency(tx.getFrequency());
        tx2.setType(tx.getType());
        tx2.setStartDate(tx.getStartDate());
        tx2.setNextOccurrence(tx.getNextOccurrence());
        tx2.setIsActive(tx.getIsActive());
        tx2.setOccurrencesProcessed(tx.getOccurrencesProcessed());
        tx2.setCreatedAt(tx.getCreatedAt());

        assertNotNull(tx.toString());
        assertEquals(tx, tx2);
        assertEquals(tx.hashCode(), tx2.hashCode());
    }

    @Test
    void testDebt() {
        Debt debt = Debt.builder()
                .id(1L)
                .userId(1L)
                .name("Student Loan")
                .type(Debt.DebtType.STUDENT_LOAN)
                .principal(new BigDecimal("10000.00"))
                .currentBalance(new BigDecimal("5000.00"))
                .interestRate(new BigDecimal("5.5"))
                .minimumPayment(new BigDecimal("200.00"))
                .dueDate(LocalDate.now().plusDays(15))
                .notes("Test debt")
                .build();

        Debt debt2 = new Debt();
        debt2.setId(debt.getId());
        debt2.setUserId(debt.getUserId());
        debt2.setName(debt.getName());
        debt2.setType(debt.getType());
        debt2.setPrincipal(debt.getPrincipal());
        debt2.setCurrentBalance(debt.getCurrentBalance());
        debt2.setInterestRate(debt.getInterestRate());
        debt2.setMinimumPayment(debt.getMinimumPayment());
        debt2.setDueDate(debt.getDueDate());
        debt2.setNotes(debt.getNotes());

        assertNotNull(debt.toString());
        assertEquals(debt, debt2);
        assertNotNull(debt.getId());
    }

    @Test
    void testBankAccount() {
        BankAccount acc = BankAccount.builder()
                .id(1L)
                .userId(1L)
                .bankName("Chase")
                .accountType("Checking")
                .accountNumber("1234")
                .balance(new BigDecimal("1000.00"))
                .currency("USD")
                .build();

        BankAccount acc2 = new BankAccount();
        acc2.setId(acc.getId());
        acc2.setUserId(acc.getUserId());
        acc2.setBankName(acc.getBankName());
        acc2.setAccountType(acc.getAccountType());
        acc2.setAccountNumber(acc.getAccountNumber());
        acc2.setBalance(acc.getBalance());
        acc2.setCurrency(acc.getCurrency());

        assertNotNull(acc.toString());
        assertEquals(acc, acc2);
        assertEquals(acc.hashCode(), acc2.hashCode());
    }
}

