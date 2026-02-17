/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.math.BigDecimal;
import java.util.Map;

public class PortfolioSummaryDto {

    private BigDecimal totalInvested;
    private BigDecimal currentValue;
    private BigDecimal totalProfitLoss;
    private BigDecimal totalProfitLossPercent;
    private Integer totalInvestments;

    // Asset allocation by type (percentage)
    private Map<String, BigDecimal> assetAllocation;

    // Top performers
    private Integer profitableInvestments;
    private Integer losingInvestments;

    public PortfolioSummaryDto() {
    }

    public PortfolioSummaryDto(BigDecimal totalInvested, BigDecimal currentValue, BigDecimal totalProfitLoss,
            BigDecimal totalProfitLossPercent, Integer totalInvestments, Map<String, BigDecimal> assetAllocation,
            Integer profitableInvestments, Integer losingInvestments) {
        this.totalInvested = totalInvested;
        this.currentValue = currentValue;
        this.totalProfitLoss = totalProfitLoss;
        this.totalProfitLossPercent = totalProfitLossPercent;
        this.totalInvestments = totalInvestments;
        this.assetAllocation = assetAllocation;
        this.profitableInvestments = profitableInvestments;
        this.losingInvestments = losingInvestments;
    }

    public BigDecimal getTotalInvested() {
        return totalInvested;
    }

    public void setTotalInvested(BigDecimal totalInvested) {
        this.totalInvested = totalInvested;
    }

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
    }

    public BigDecimal getTotalProfitLoss() {
        return totalProfitLoss;
    }

    public void setTotalProfitLoss(BigDecimal totalProfitLoss) {
        this.totalProfitLoss = totalProfitLoss;
    }

    public BigDecimal getTotalProfitLossPercent() {
        return totalProfitLossPercent;
    }

    public void setTotalProfitLossPercent(BigDecimal totalProfitLossPercent) {
        this.totalProfitLossPercent = totalProfitLossPercent;
    }

    public Integer getTotalInvestments() {
        return totalInvestments;
    }

    public void setTotalInvestments(Integer totalInvestments) {
        this.totalInvestments = totalInvestments;
    }

    public Map<String, BigDecimal> getAssetAllocation() {
        return assetAllocation;
    }

    public void setAssetAllocation(Map<String, BigDecimal> assetAllocation) {
        this.assetAllocation = assetAllocation;
    }

    public Integer getProfitableInvestments() {
        return profitableInvestments;
    }

    public void setProfitableInvestments(Integer profitableInvestments) {
        this.profitableInvestments = profitableInvestments;
    }

    public Integer getLosingInvestments() {
        return losingInvestments;
    }

    public void setLosingInvestments(Integer losingInvestments) {
        this.losingInvestments = losingInvestments;
    }

    public static PortfolioSummaryDtoBuilder builder() {
        return new PortfolioSummaryDtoBuilder();
    }

    public static class PortfolioSummaryDtoBuilder {
        private BigDecimal totalInvested;
        private BigDecimal currentValue;
        private BigDecimal totalProfitLoss;
        private BigDecimal totalProfitLossPercent;
        private Integer totalInvestments;
        private Map<String, BigDecimal> assetAllocation;
        private Integer profitableInvestments;
        private Integer losingInvestments;

        public PortfolioSummaryDtoBuilder totalInvested(BigDecimal totalInvested) {
            this.totalInvested = totalInvested;
            return this;
        }

        public PortfolioSummaryDtoBuilder currentValue(BigDecimal currentValue) {
            this.currentValue = currentValue;
            return this;
        }

        public PortfolioSummaryDtoBuilder totalProfitLoss(BigDecimal totalProfitLoss) {
            this.totalProfitLoss = totalProfitLoss;
            return this;
        }

        public PortfolioSummaryDtoBuilder totalProfitLossPercent(BigDecimal totalProfitLossPercent) {
            this.totalProfitLossPercent = totalProfitLossPercent;
            return this;
        }

        public PortfolioSummaryDtoBuilder totalInvestments(Integer totalInvestments) {
            this.totalInvestments = totalInvestments;
            return this;
        }

        public PortfolioSummaryDtoBuilder assetAllocation(Map<String, BigDecimal> assetAllocation) {
            this.assetAllocation = assetAllocation;
            return this;
        }

        public PortfolioSummaryDtoBuilder profitableInvestments(Integer profitableInvestments) {
            this.profitableInvestments = profitableInvestments;
            return this;
        }

        public PortfolioSummaryDtoBuilder losingInvestments(Integer losingInvestments) {
            this.losingInvestments = losingInvestments;
            return this;
        }

        public PortfolioSummaryDto build() {
            return new PortfolioSummaryDto(totalInvested, currentValue, totalProfitLoss, totalProfitLossPercent,
                    totalInvestments, assetAllocation, profitableInvestments, losingInvestments);
        }
    }
}
