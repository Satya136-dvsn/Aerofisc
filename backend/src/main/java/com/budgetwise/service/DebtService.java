/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.DebtDto;
import com.budgetwise.dto.DebtPayoffPlanDto;
import com.budgetwise.dto.DebtSummaryDto;
import com.budgetwise.entity.Debt;
import com.budgetwise.exception.ResourceNotFoundException;
import com.budgetwise.repository.DebtRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DebtService {

    private final DebtRepository debtRepository;

    public DebtService(DebtRepository debtRepository) {
        this.debtRepository = debtRepository;
    }

    @Transactional
    public DebtDto createDebt(DebtDto dto, Long userId) {
        Debt debt = new Debt();
        debt.setUserId(userId);
        debt.setName(dto.getName());
        debt.setType(dto.getType());
        debt.setPrincipal(dto.getPrincipal());
        debt.setCurrentBalance(dto.getCurrentBalance());
        debt.setInterestRate(dto.getInterestRate());
        debt.setMinimumPayment(dto.getMinimumPayment());
        debt.setDueDate(dto.getDueDate());
        debt.setNotes(dto.getNotes());

        Debt saved = debtRepository.save(debt);
        return mapToDto(saved);
    }

    public List<DebtDto> getAllDebts(Long userId) {
        return debtRepository.findByUserIdOrderByInterestRateDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DebtDto getDebtById(Long id, Long userId) {
        Debt debt = debtRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Debt not found"));
        return mapToDto(debt);
    }

    @Transactional
    public DebtDto updateDebt(Long id, DebtDto dto, Long userId) {
        Debt debt = debtRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Debt not found"));

        debt.setName(dto.getName());
        debt.setType(dto.getType());
        debt.setPrincipal(dto.getPrincipal());
        debt.setCurrentBalance(dto.getCurrentBalance());
        debt.setInterestRate(dto.getInterestRate());
        debt.setMinimumPayment(dto.getMinimumPayment());
        debt.setDueDate(dto.getDueDate());
        debt.setNotes(dto.getNotes());

        Debt updated = debtRepository.save(debt);
        return mapToDto(updated);
    }

    @Transactional
    @CacheEvict(value = { "dashboard_summary", "dashboard_trends", "dashboard_breakdown" }, allEntries = true)
    public void deleteDebt(Long id, Long userId) {
        Debt debt = debtRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Debt not found"));
        debtRepository.delete(debt);
    }

    public DebtSummaryDto getDebtSummary(Long userId) {
        List<Debt> debts = debtRepository.findByUserIdOrderByInterestRateDesc(userId);

        if (debts.isEmpty()) {
            return DebtSummaryDto.builder()
                    .totalDebt(BigDecimal.ZERO)
                    .totalMinimumPayment(BigDecimal.ZERO)
                    .numberOfDebts(0)
                    .averageInterestRate(BigDecimal.ZERO)
                    .estimatedPayoffMonths(0)
                    .totalInterestProjected(BigDecimal.ZERO)
                    .debts(new ArrayList<>())
                    .build();
        }

        BigDecimal totalDebt = debts.stream()
                .map(Debt::getCurrentBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalMinPayment = debts.stream()
                .map(Debt::getMinimumPayment)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgInterestRate = debts.stream()
                .map(Debt::getInterestRate)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(debts.size()), 2, RoundingMode.HALF_UP);

        // Estimate payoff months using minimum payments
        int estimatedMonths = calculatePayoffMonths(debts, totalMinPayment);

        // Calculate total interest with minimum payments
        BigDecimal totalInterest = calculateTotalInterest(debts, totalMinPayment);

        return DebtSummaryDto.builder()
                .totalDebt(totalDebt.setScale(2, RoundingMode.HALF_UP))
                .totalMinimumPayment(totalMinPayment.setScale(2, RoundingMode.HALF_UP))
                .numberOfDebts(debts.size())
                .averageInterestRate(avgInterestRate)
                .estimatedPayoffMonths(estimatedMonths)
                .totalInterestProjected(totalInterest.setScale(2, RoundingMode.HALF_UP))
                .debts(debts.stream().map(this::mapToDto).collect(Collectors.toList()))
                .build();
    }

    public DebtPayoffPlanDto calculatePayoffPlan(Long userId, String strategy, BigDecimal extraPayment) {
        List<Debt> debts = debtRepository.findByUserIdOrderByInterestRateDesc(userId);

        if (debts.isEmpty()) {
            return DebtPayoffPlanDto.builder()
                    .strategy(strategy)
                    .steps(new ArrayList<>())
                    .totalMonths(0)
                    .totalInterestPaid(BigDecimal.ZERO)
                    .monthlySurplus(extraPayment)
                    .build();
        }

        // Sort debts based on strategy
        List<Debt> sortedDebts = sortDebtsByStrategy(debts, strategy);

        BigDecimal totalMinPayment = sortedDebts.stream()
                .map(Debt::getMinimumPayment)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPayment = totalMinPayment.add(extraPayment != null ? extraPayment : BigDecimal.ZERO);

        List<DebtPayoffPlanDto.DebtPayoffStep> steps = new ArrayList<>();
        int month = 0;
        BigDecimal totalInterestPaid = BigDecimal.ZERO;

        // Create working copies of balances
        List<DebtBalance> balances = sortedDebts.stream()
                .map(d -> new DebtBalance(d.getId(), d.getName(), d.getCurrentBalance(), d.getInterestRate(),
                        d.getMinimumPayment()))
                .collect(Collectors.toList());

        while (balances.stream().anyMatch(b -> b.balance.compareTo(BigDecimal.ZERO) > 0)) {
            month++;
            BigDecimal remainingPayment = totalPayment;

            // Apply minimum payments first
            for (DebtBalance db : balances) {
                if (db.balance.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal interest = db.balance.multiply(db.monthlyRate);
                    BigDecimal minPay = db.balance.add(interest).min(db.minimumPayment);
                    db.balance = db.balance.add(interest).subtract(minPay);
                    totalInterestPaid = totalInterestPaid.add(interest);
                    remainingPayment = remainingPayment.subtract(minPay);

                    if (db.balance.compareTo(BigDecimal.ZERO) < 0) {
                        db.balance = BigDecimal.ZERO;
                    }
                }
            }

            // Apply extra payment to first debt with balance
            for (DebtBalance db : balances) {
                if (db.balance.compareTo(BigDecimal.ZERO) > 0 && remainingPayment.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal payment = db.balance.min(remainingPayment);
                    db.balance = db.balance.subtract(payment);

                    if (db.balance.compareTo(BigDecimal.ZERO) <= 0) {
                        // Debt paid off
                        steps.add(DebtPayoffPlanDto.DebtPayoffStep.builder()
                                .debtId(db.id)
                                .debtName(db.name)
                                .payoffMonth(month)
                                .totalPaid(BigDecimal.ZERO) // Calculate if needed
                                .interestPaid(BigDecimal.ZERO) // Track per debt if needed
                                .build());
                        db.balance = BigDecimal.ZERO;
                    }
                    break;
                }
            }

            // Safety check to prevent infinite loop
            if (month > 600)
                break; // 50 years
        }

        return DebtPayoffPlanDto.builder()
                .strategy(strategy)
                .steps(steps)
                .totalMonths(month)
                .totalInterestPaid(totalInterestPaid.setScale(2, RoundingMode.HALF_UP))
                .monthlySurplus(extraPayment)
                .build();
    }

    private List<Debt> sortDebtsByStrategy(List<Debt> debts, String strategy) {
        if ("SNOWBALL".equalsIgnoreCase(strategy)) {
            // Sort by balance (smallest first)
            return debts.stream()
                    .sorted(Comparator.comparing(Debt::getCurrentBalance))
                    .collect(Collectors.toList());
        } else {
            // AVALANCHE - Sort by interest rate (highest first)
            return debts.stream()
                    .sorted(Comparator.comparing(Debt::getInterestRate).reversed())
                    .collect(Collectors.toList());
        }
    }

    private int calculatePayoffMonths(List<Debt> debts, BigDecimal totalPayment) {
        int maxMonths = 0;
        for (Debt debt : debts) {
            BigDecimal balance = debt.getCurrentBalance();
            BigDecimal monthlyRate = debt.getInterestRate().divide(BigDecimal.valueOf(100 * 12), 6,
                    RoundingMode.HALF_UP);
            BigDecimal payment = debt.getMinimumPayment();

            int months = 0;
            while (balance.compareTo(BigDecimal.ZERO) > 0 && months < 600) {
                BigDecimal interest = balance.multiply(monthlyRate);
                balance = balance.add(interest).subtract(payment);
                months++;
            }
            maxMonths = Math.max(maxMonths, months);
        }
        return maxMonths;
    }

    private BigDecimal calculateTotalInterest(List<Debt> debts, BigDecimal totalPayment) {
        BigDecimal totalInterest = BigDecimal.ZERO;
        for (Debt debt : debts) {
            BigDecimal balance = debt.getCurrentBalance();
            BigDecimal monthlyRate = debt.getInterestRate().divide(BigDecimal.valueOf(100 * 12), 6,
                    RoundingMode.HALF_UP);
            BigDecimal payment = debt.getMinimumPayment();

            int months = 0;
            while (balance.compareTo(BigDecimal.ZERO) > 0 && months < 600) {
                BigDecimal interest = balance.multiply(monthlyRate);
                totalInterest = totalInterest.add(interest);
                balance = balance.add(interest).subtract(payment);
                months++;
            }
        }
        return totalInterest;
    }

    private DebtDto mapToDto(Debt debt) {
        BigDecimal monthlyRate = debt.getInterestRate().divide(BigDecimal.valueOf(100 * 12), 6, RoundingMode.HALF_UP);
        BigDecimal monthlyInterest = debt.getCurrentBalance().multiply(monthlyRate);

        // Estimate months to payoff with minimum payment
        int months = estimateMonthsToPayoff(debt.getCurrentBalance(), debt.getMinimumPayment(), monthlyRate);

        return DebtDto.builder()
                .id(debt.getId())
                .name(debt.getName())
                .type(debt.getType())
                .principal(debt.getPrincipal())
                .currentBalance(debt.getCurrentBalance())
                .interestRate(debt.getInterestRate())
                .minimumPayment(debt.getMinimumPayment())
                .dueDate(debt.getDueDate())
                .notes(debt.getNotes())
                .createdAt(debt.getCreatedAt())
                .updatedAt(debt.getUpdatedAt())
                .monthlyInterest(monthlyInterest.setScale(2, RoundingMode.HALF_UP))
                .monthsToPayoff(months)
                .totalInterestPaid(BigDecimal.ZERO) // Calculate if needed
                .build();
    }

    private int estimateMonthsToPayoff(BigDecimal balance, BigDecimal payment, BigDecimal monthlyRate) {
        int months = 0;
        BigDecimal workingBalance = balance;

        while (workingBalance.compareTo(BigDecimal.ZERO) > 0 && months < 600) {
            BigDecimal interest = workingBalance.multiply(monthlyRate);
            workingBalance = workingBalance.add(interest).subtract(payment);
            months++;
        }
        return months;
    }

    // Helper class for payoff calculations
    private static class DebtBalance {
        Long id;
        String name;
        BigDecimal balance;
        BigDecimal monthlyRate;
        BigDecimal minimumPayment;

        DebtBalance(Long id, String name, BigDecimal balance, BigDecimal annualRate, BigDecimal minimumPayment) {
            this.id = id;
            this.name = name;
            this.balance = balance;
            this.monthlyRate = annualRate.divide(BigDecimal.valueOf(100 * 12), 6, RoundingMode.HALF_UP);
            this.minimumPayment = minimumPayment;
        }
    }
}
