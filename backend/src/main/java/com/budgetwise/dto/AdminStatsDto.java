/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

public class AdminStatsDto {
    private Long totalUsers;
    private Long totalTransactions;
    private Long totalCategories;
    private Long activeUsers;
    private Long totalPosts;
    private Long totalBudgets;
    private Long totalGoals;
    private java.math.BigDecimal revenue;

    public AdminStatsDto() {
    }

    public AdminStatsDto(Long totalUsers, Long totalTransactions, Long totalCategories, Long activeUsers,
            Long totalPosts, Long totalBudgets, Long totalGoals, java.math.BigDecimal revenue) {
        this.totalUsers = totalUsers;
        this.totalTransactions = totalTransactions;
        this.totalCategories = totalCategories;
        this.activeUsers = activeUsers;
        this.totalPosts = totalPosts;
        this.totalBudgets = totalBudgets;
        this.totalGoals = totalGoals;
        this.revenue = revenue;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public Long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public Long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(Long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public Long getTotalPosts() {
        return totalPosts;
    }

    public void setTotalPosts(Long totalPosts) {
        this.totalPosts = totalPosts;
    }

    public Long getTotalBudgets() {
        return totalBudgets;
    }

    public void setTotalBudgets(Long totalBudgets) {
        this.totalBudgets = totalBudgets;
    }

    public Long getTotalGoals() {
        return totalGoals;
    }

    public void setTotalGoals(Long totalGoals) {
        this.totalGoals = totalGoals;
    }

    public java.math.BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(java.math.BigDecimal revenue) {
        this.revenue = revenue;
    }

    public static AdminStatsDtoBuilder builder() {
        return new AdminStatsDtoBuilder();
    }

    public static class AdminStatsDtoBuilder {
        private Long totalUsers;
        private Long totalTransactions;
        private Long totalCategories;
        private Long activeUsers;
        private Long totalPosts;
        private Long totalBudgets;
        private Long totalGoals;
        private java.math.BigDecimal revenue;

        public AdminStatsDtoBuilder totalUsers(Long totalUsers) {
            this.totalUsers = totalUsers;
            return this;
        }

        public AdminStatsDtoBuilder totalTransactions(Long totalTransactions) {
            this.totalTransactions = totalTransactions;
            return this;
        }

        public AdminStatsDtoBuilder totalCategories(Long totalCategories) {
            this.totalCategories = totalCategories;
            return this;
        }

        public AdminStatsDtoBuilder activeUsers(Long activeUsers) {
            this.activeUsers = activeUsers;
            return this;
        }

        public AdminStatsDtoBuilder totalPosts(Long totalPosts) {
            this.totalPosts = totalPosts;
            return this;
        }

        public AdminStatsDtoBuilder totalBudgets(Long totalBudgets) {
            this.totalBudgets = totalBudgets;
            return this;
        }

        public AdminStatsDtoBuilder totalGoals(Long totalGoals) {
            this.totalGoals = totalGoals;
            return this;
        }

        public AdminStatsDtoBuilder revenue(java.math.BigDecimal revenue) {
            this.revenue = revenue;
            return this;
        }

        public AdminStatsDto build() {
            return new AdminStatsDto(totalUsers, totalTransactions, totalCategories, activeUsers, totalPosts,
                    totalBudgets, totalGoals, revenue);
        }
    }
}
