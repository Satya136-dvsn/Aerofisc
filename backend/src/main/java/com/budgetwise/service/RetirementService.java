/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.RetirementDto;
import com.budgetwise.entity.RetirementAccount;
import com.budgetwise.exception.ResourceNotFoundException;
import com.budgetwise.repository.RetirementAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RetirementService {

    private final RetirementAccountRepository repository;

    public RetirementService(RetirementAccountRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public RetirementDto createAccount(RetirementDto dto, Long userId) {
        RetirementAccount account = RetirementAccount.builder()
                .userId(userId)
                .name(dto.getName())
                .accountType(dto.getAccountType())
                .balance(dto.getBalance())
                .contributionAmount(dto.getContributionAmount())
                .employerMatch(dto.getEmployerMatch())
                .build();

        RetirementAccount saved = repository.save(account);
        return mapToDto(saved);
    }

    public List<RetirementDto> getAllAccounts(Long userId) {
        return repository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public RetirementDto getAccountById(Long id, Long userId) {
        RetirementAccount account = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Retirement account not found"));
        return mapToDto(account);
    }

    @Transactional
    public RetirementDto updateAccount(Long id, RetirementDto dto, Long userId) {
        RetirementAccount account = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Retirement account not found"));

        account.setName(dto.getName());
        account.setAccountType(dto.getAccountType());
        account.setBalance(dto.getBalance());
        account.setContributionAmount(dto.getContributionAmount());
        account.setEmployerMatch(dto.getEmployerMatch());

        RetirementAccount updated = repository.save(account);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteAccount(Long id, Long userId) {
        RetirementAccount account = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Retirement account not found"));
        repository.delete(account);
    }

    public BigDecimal calculateProjection(Long userId, int yearsToRetirement, double assumedReturn) {
        List<RetirementAccount> accounts = repository.findByUserId(userId);
        BigDecimal totalBalance = accounts.stream()
                .map(RetirementAccount::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal monthlyContribution = accounts.stream()
                .map(a -> a.getContributionAmount() != null ? a.getContributionAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Simple compound interest formula: FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
        double monthlyRate = assumedReturn / 12;
        int months = yearsToRetirement * 12;

        double futureValue = totalBalance.doubleValue() * Math.pow(1 + monthlyRate, months);

        if (monthlyRate > 0) {
            futureValue += monthlyContribution.doubleValue() *
                    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        }

        return BigDecimal.valueOf(futureValue).setScale(2, RoundingMode.HALF_UP);
    }

    private RetirementDto mapToDto(RetirementAccount account) {
        return RetirementDto.builder()
                .id(account.getId())
                .name(account.getName())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .contributionAmount(account.getContributionAmount())
                .employerMatch(account.getEmployerMatch())
                .build();
    }
}
