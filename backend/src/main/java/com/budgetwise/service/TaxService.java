/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.TaxEstimateDto;
import com.budgetwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class TaxService {

    private final TransactionRepository transactionRepository;
    private final ProfileService profileService;

    public TaxService(TransactionRepository transactionRepository, ProfileService profileService) {
        this.transactionRepository = transactionRepository;
        this.profileService = profileService;
    }

    public TaxEstimateDto calculateTaxEstimate(Long userId) {
        // Get annual income
        var profile = profileService.getProfile(userId);
        BigDecimal monthlyIncome = profile.getMonthlyIncome() != null ? profile.getMonthlyIncome() : BigDecimal.ZERO;
        BigDecimal annualIncome = monthlyIncome.multiply(BigDecimal.valueOf(12));

        // Calculate deductions (simplified)
        Map<String, BigDecimal> deductions = calculateDeductions(userId);
        BigDecimal totalDeductions = deductions.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Taxable income
        BigDecimal taxableIncome = annualIncome.subtract(totalDeductions);
        if (taxableIncome.compareTo(BigDecimal.ZERO) < 0) {
            taxableIncome = BigDecimal.ZERO;
        }

        // Calculate tax (using simplified Indian tax brackets)
        BigDecimal tax = calculateTax(taxableIncome);
        String bracket = getTaxBracket(taxableIncome);
        BigDecimal effectiveRate = annualIncome.compareTo(BigDecimal.ZERO) > 0
                ? tax.divide(annualIncome, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        return TaxEstimateDto.builder()
                .totalIncome(annualIncome.setScale(2, RoundingMode.HALF_UP))
                .totalDeductions(totalDeductions.setScale(2, RoundingMode.HALF_UP))
                .taxableIncome(taxableIncome.setScale(2, RoundingMode.HALF_UP))
                .estimatedTax(tax.setScale(2, RoundingMode.HALF_UP))
                .taxBracket(bracket)
                .effectiveRate(effectiveRate.setScale(2, RoundingMode.HALF_UP))
                .deductionBreakdown(deductions)
                .build();
    }

    private Map<String, BigDecimal> calculateDeductions(Long userId) {
        Map<String, BigDecimal> deductions = new HashMap<>();

        // Standard deduction
        deductions.put("Standard Deduction", BigDecimal.valueOf(50000));

        // Add more deduction calculations as needed
        return deductions;
    }

    private BigDecimal calculateTax(BigDecimal income) {
        // Simplified Indian tax calculation (2024 rates)
        BigDecimal tax = BigDecimal.ZERO;

        if (income.compareTo(BigDecimal.valueOf(250000)) <= 0) {
            return BigDecimal.ZERO;
        }

        // 5% for income between 250,001 and 500,000
        if (income.compareTo(BigDecimal.valueOf(500000)) > 0) {
            tax = tax.add(BigDecimal.valueOf(250000).multiply(BigDecimal.valueOf(0.05)));
        } else {
            tax = tax.add(income.subtract(BigDecimal.valueOf(250000)).multiply(BigDecimal.valueOf(0.05)));
            return tax;
        }

        // 10% for income between 500,001 and 1,000,000
        if (income.compareTo(BigDecimal.valueOf(1000000)) > 0) {
            tax = tax.add(BigDecimal.valueOf(500000).multiply(BigDecimal.valueOf(0.10)));
        } else {
            tax = tax.add(income.subtract(BigDecimal.valueOf(500000)).multiply(BigDecimal.valueOf(0.10)));
            return tax;
        }

        // 15% for income above 1,000,000
        tax = tax.add(income.subtract(BigDecimal.valueOf(1000000)).multiply(BigDecimal.valueOf(0.15)));

        return tax;
    }

    private String getTaxBracket(BigDecimal income) {
        if (income.compareTo(BigDecimal.valueOf(250000)) <= 0)
            return "0%";
        if (income.compareTo(BigDecimal.valueOf(500000)) <= 0)
            return "5%";
        if (income.compareTo(BigDecimal.valueOf(1000000)) <= 0)
            return "10%";
        return "15%";
    }
}
