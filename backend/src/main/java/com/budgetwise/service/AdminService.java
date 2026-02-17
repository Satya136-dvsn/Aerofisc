/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.AdminStatsDto;
import com.budgetwise.entity.AuditLog;
import com.budgetwise.entity.User;
import com.budgetwise.repository.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import com.budgetwise.service.TaxService;
import com.budgetwise.service.FinancialHealthService;
import com.budgetwise.dto.TaxEstimateDto;
import com.budgetwise.dto.FinancialHealthDto;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final BillRepository billRepository;
    private final InvestmentRepository investmentRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final ScheduledReportRepository scheduledReportRepository;
    private final UserProfileRepository userProfileRepository;
    private final DebtRepository debtRepository;
    private final TaxService taxService;
    private final FinancialHealthService financialHealthService;

    public AdminService(UserRepository userRepository, TransactionRepository transactionRepository,
            CategoryRepository categoryRepository, AuditLogRepository auditLogRepository,
            BudgetRepository budgetRepository, SavingsGoalRepository savingsGoalRepository,
            BillRepository billRepository, InvestmentRepository investmentRepository, PostRepository postRepository,
            CommentRepository commentRepository, LikeRepository likeRepository,
            ScheduledReportRepository scheduledReportRepository, UserProfileRepository userProfileRepository,
            DebtRepository debtRepository, TaxService taxService, FinancialHealthService financialHealthService) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.budgetRepository = budgetRepository;
        this.savingsGoalRepository = savingsGoalRepository;
        this.billRepository = billRepository;
        this.investmentRepository = investmentRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
        this.scheduledReportRepository = scheduledReportRepository;
        this.userProfileRepository = userProfileRepository;
        this.debtRepository = debtRepository;
        this.taxService = taxService;
        this.financialHealthService = financialHealthService;
    }

    public AdminStatsDto getSystemStats() {
        long totalUsers = userRepository.count();
        long totalTransactions = transactionRepository.count();
        long totalCategories = categoryRepository.count();
        long activeUsers = userRepository.countByIsActive(true);
        BigDecimal revenue = transactionRepository
                .sumTotalByType(com.budgetwise.entity.Transaction.TransactionType.INCOME);

        return AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .totalTransactions(totalTransactions)
                .totalCategories(totalCategories)
                .activeUsers(activeUsers)
                .revenue(revenue != null ? revenue : BigDecimal.ZERO)
                .build();
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public void logAdminAction(Long adminUserId, String actionType, Long targetUserId,
            String targetResource, String details, String ipAddress) {
        String fullDetails = String.format("Target User: %d, Resource: %s. %s", targetUserId, targetResource, details);
        AuditLog log = AuditLog.builder()
                .userId(adminUserId)
                .action(actionType)
                .details(fullDetails)
                .ipAddress(ipAddress)
                .eventTimestamp(java.time.LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }

    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByEventTimestampDesc(pageable);
    }

    public void updateUserStatus(Long userId, Boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        // 1. Handle Community Data (Posts, Comments, Likes)
        // A. Delete likes on user's comments (by others)
        List<com.budgetwise.entity.Comment> userComments = commentRepository.findByUserId(userId);
        List<Long> userCommentIds = userComments.stream().map(com.budgetwise.entity.Comment::getId).toList();
        if (!userCommentIds.isEmpty()) {
            likeRepository.deleteByCommentIdIn(userCommentIds);
        }

        // B. Delete user's comments (safe now)
        commentRepository.deleteByUserId(userId);

        // C. Delete likes and comments on user's posts (by others)
        List<com.budgetwise.entity.Post> userPosts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<Long> userPostIds = userPosts.stream().map(com.budgetwise.entity.Post::getId).toList();
        if (!userPostIds.isEmpty()) {
            likeRepository.deleteByPostIdIn(userPostIds);
            commentRepository.deleteByPostIdIn(userPostIds);
        }

        // D. Delete user's posts
        postRepository.deleteByUserId(userId);

        // E. Delete user's likes (on others' posts/comments)
        likeRepository.deleteByUserId(userId);

        // 2. Handle Financial Data
        transactionRepository.deleteByUserId(userId);
        budgetRepository.deleteByUserId(userId);
        savingsGoalRepository.deleteByUserId(userId);
        billRepository.deleteByUserId(userId);
        investmentRepository.deleteByUserId(userId);

        // 3. Handle Other Data
        scheduledReportRepository.deleteByUserId(userId);
        userProfileRepository.deleteByUserId(userId);
        categoryRepository.deleteByUserId(userId); // Custom categories

        // 4. Delete User
        userRepository.deleteById(userId);
    }

    public java.util.Map<String, Object> getUserCompleteProfile(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        java.util.Map<String, Object> profile = new java.util.HashMap<>();

        // User basic info (without password)
        com.budgetwise.entity.User user = userRepository.findById(userId).orElseThrow();
        java.util.Map<String, Object> userInfo = new java.util.HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("role", user.getRole().toString());
        userInfo.put("isActive", user.getIsActive());
        userInfo.put("createdAt", user.getCreatedAt());
        profile.put("user", userInfo);

        // User profile (including avatar/photo)
        com.budgetwise.entity.UserProfile userProfile = userProfileRepository.findByUserId(userId).orElse(null);
        if (userProfile != null) {
            java.util.Map<String, Object> profileInfo = new java.util.HashMap<>();
            profileInfo.put("firstName", userProfile.getFirstName());
            profileInfo.put("lastName", userProfile.getLastName());
            profileInfo.put("monthlyIncome", userProfile.getMonthlyIncome());
            profileInfo.put("savingsTarget", userProfile.getSavingsTarget());
            profileInfo.put("avatar", userProfile.getAvatar()); // Profile photo included for admin view
            profileInfo.put("currency", userProfile.getCurrency());
            profileInfo.put("timezone", userProfile.getTimezone());
            profile.put("profile", profileInfo);
        }

        // Financial summary
        java.util.List<com.budgetwise.entity.Transaction> allTransactions = transactionRepository
                .findByUserIdOrderByCreatedAtDesc(userId);

        BigDecimal totalIncome = allTransactions.stream()
                .filter(t -> t.getType() == com.budgetwise.entity.Transaction.TransactionType.INCOME)
                .map(com.budgetwise.entity.Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = allTransactions.stream()
                .filter(t -> t.getType() == com.budgetwise.entity.Transaction.TransactionType.EXPENSE)
                .map(com.budgetwise.entity.Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        java.util.Map<String, BigDecimal> financialSummary = new java.util.HashMap<>();
        financialSummary.put("totalIncome", totalIncome);
        financialSummary.put("totalExpenses", totalExpenses);
        financialSummary.put("netBalance", totalIncome.subtract(totalExpenses));
        profile.put("financialSummary", financialSummary);

        // Full transactions list (all of them, not just 5)
        java.util.List<java.util.Map<String, Object>> transactionsList = new java.util.ArrayList<>();
        for (com.budgetwise.entity.Transaction txn : allTransactions) {
            java.util.Map<String, Object> txnMap = new java.util.HashMap<>();
            txnMap.put("id", txn.getId());
            txnMap.put("amount", txn.getAmount());
            txnMap.put("type", txn.getType().toString());
            txnMap.put("description", txn.getDescription());
            txnMap.put("date", txn.getTransactionDate());
            txnMap.put("categoryId", txn.getCategoryId());
            transactionsList.add(txnMap);
        }
        profile.put("transactions", transactionsList);
        profile.put("recentTransactions",
                transactionsList.stream().limit(5).collect(java.util.stream.Collectors.toList()));

        // Full budgets list
        java.util.List<com.budgetwise.entity.Budget> budgets = budgetRepository.findByUserId(userId);
        java.util.List<java.util.Map<String, Object>> budgetsList = new java.util.ArrayList<>();
        for (com.budgetwise.entity.Budget budget : budgets) {
            java.util.Map<String, Object> budgetMap = new java.util.HashMap<>();
            budgetMap.put("id", budget.getId());
            budgetMap.put("categoryId", budget.getCategoryId());
            budgetMap.put("amount", budget.getAmount());
            budgetMap.put("spent", budget.getSpent());
            budgetMap.put("period", budget.getPeriod());
            budgetMap.put("startDate", budget.getStartDate());
            budgetMap.put("endDate", budget.getEndDate());
            budgetsList.add(budgetMap);
        }
        profile.put("budgets", budgetsList);

        // Full savings goals list
        java.util.List<com.budgetwise.entity.SavingsGoal> goals = savingsGoalRepository.findByUserId(userId);
        java.util.List<java.util.Map<String, Object>> goalsList = new java.util.ArrayList<>();
        for (com.budgetwise.entity.SavingsGoal goal : goals) {
            java.util.Map<String, Object> goalMap = new java.util.HashMap<>();
            goalMap.put("id", goal.getId());
            goalMap.put("name", goal.getName());
            goalMap.put("targetAmount", goal.getTargetAmount());
            goalMap.put("currentAmount", goal.getCurrentAmount());
            goalMap.put("targetDate", goal.getDeadline());
            goalMap.put("status", goal.getStatus());
            goalsList.add(goalMap);
        }
        profile.put("savingsGoals", goalsList);

        // Counts for quick reference
        profile.put("totalTransactions", allTransactions.size());
        profile.put("budgetCount", budgets.size());
        profile.put("savingsGoalCount", goals.size());
        profile.put("billCount", billRepository.findByUserIdOrderByNextDueDateAsc(userId).size());
        profile.put("investmentCount", investmentRepository.findByUserIdOrderByPurchaseDateDesc(userId).size());

        // Advanced Features Data
        // 1. Debts
        java.util.List<com.budgetwise.entity.Debt> debts = debtRepository.findByUserIdOrderByInterestRateDesc(userId);
        java.util.List<java.util.Map<String, Object>> debtsList = new java.util.ArrayList<>();
        BigDecimal totalDebt = BigDecimal.ZERO;
        for (com.budgetwise.entity.Debt debt : debts) {
            java.util.Map<String, Object> debtMap = new java.util.HashMap<>();
            debtMap.put("id", debt.getId());
            debtMap.put("name", debt.getName());
            debtMap.put("currentBalance", debt.getCurrentBalance());
            debtMap.put("interestRate", debt.getInterestRate());
            debtsList.add(debtMap);
            totalDebt = totalDebt.add(debt.getCurrentBalance());
        }
        profile.put("debts", debtsList);
        profile.put("totalDebt", totalDebt);

        // 2. Tax Estimate
        try {
            com.budgetwise.dto.TaxEstimateDto taxEstimate = taxService.calculateTaxEstimate(userId);
            profile.put("taxEstimate", taxEstimate);
        } catch (Exception e) {
            profile.put("taxEstimate", null);
        }

        // 3. Financial Health
        try {
            com.budgetwise.dto.FinancialHealthDto health = financialHealthService.calculateHealthScore(userId);
            profile.put("financialHealth", health);
        } catch (Exception e) {
            profile.put("financialHealth", null);
        }

        return profile;
    }
}
