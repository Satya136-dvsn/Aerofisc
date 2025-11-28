package com.budgetwise.service;

import com.budgetwise.entity.BankAccount;
import com.budgetwise.repository.BankAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Service
public class BankingService {

    private final BankAccountRepository bankAccountRepository;

    public BankingService(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    public List<BankAccount> getAllAccounts(Long userId) {
        return bankAccountRepository.findByUserId(userId);
    }

    @Transactional
    public BankAccount linkAccount(Long userId, String bankName, String accountType) {
        // Mock linking process
        Random rand = new Random();
        String accountNumber = "****" + (1000 + rand.nextInt(9000));
        BigDecimal balance = BigDecimal.valueOf(1000 + rand.nextInt(50000));

        BankAccount account = BankAccount.builder()
                .userId(userId)
                .bankName(bankName)
                .accountType(accountType)
                .accountNumber(accountNumber)
                .balance(balance)
                .currency("INR")
                .logoUrl("default_bank_logo.png")
                .build();

        return bankAccountRepository.save(account);
    }

    @Transactional
    public void unlinkAccount(Long id, Long userId) {
        BankAccount account = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to account");
        }

        bankAccountRepository.delete(account);
    }

    public void syncTransactions(Long accountId, Long userId) {
        // Mock sync logic - in a real app, this would call Plaid/Yodlee
        // For now, we just update the balance slightly to simulate activity
        BankAccount account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to account");
        }

        // Randomly add or subtract a small amount
        Random rand = new Random();
        double change = (rand.nextDouble() * 1000) - 500; // -500 to +500
        account.setBalance(account.getBalance().add(BigDecimal.valueOf(change)));

        bankAccountRepository.save(account);
    }
}
