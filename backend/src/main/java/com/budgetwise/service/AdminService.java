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

    public AdminService(UserRepository userRepository, TransactionRepository transactionRepository,
            CategoryRepository categoryRepository, AuditLogRepository auditLogRepository,
            BudgetRepository budgetRepository, SavingsGoalRepository savingsGoalRepository,
            BillRepository billRepository, InvestmentRepository investmentRepository, PostRepository postRepository,
            CommentRepository commentRepository, LikeRepository likeRepository,
            ScheduledReportRepository scheduledReportRepository, UserProfileRepository userProfileRepository) {
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
        AuditLog log = AuditLog.builder()
                .adminUserId(adminUserId)
                .actionType(actionType)
                .targetUserId(targetUserId)
                .targetResource(targetResource)
                .details(details)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(log);
    }

    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
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

        // User profile
        com.budgetwise.entity.UserProfile userProfile = userProfileRepository.findByUserId(userId).orElse(null);
        if (userProfile != null) {
            java.util.Map<String, Object> profileInfo = new java.util.HashMap<>();
            profileInfo.put("monthlyIncome", userProfile.getMonthlyIncome());
            profileInfo.put("savingsTarget", userProfile.getSavingsTarget());
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

        // Counts only (avoid complex entity serialization)
        profile.put("budgetCount", budgetRepository.findByUserId(userId).size());
        profile.put("savingsGoalCount", savingsGoalRepository.findByUserId(userId).size());
        profile.put("totalTransactions", allTransactions.size());
        profile.put("billCount", billRepository.findByUserIdOrderByNextDueDateAsc(userId).size());
        profile.put("investmentCount", investmentRepository.findByUserIdOrderByPurchaseDateDesc(userId).size());

        // Recent transactions (just 5, simple mapping)
        java.util.List<java.util.Map<String, Object>> recentTxns = new java.util.ArrayList<>();
        for (int i = 0; i < Math.min(5, allTransactions.size()); i++) {
            com.budgetwise.entity.Transaction txn = allTransactions.get(i);
            java.util.Map<String, Object> txnMap = new java.util.HashMap<>();
            txnMap.put("id", txn.getId());
            txnMap.put("amount", txn.getAmount());
            txnMap.put("type", txn.getType().toString());
            txnMap.put("description", txn.getDescription());
            txnMap.put("date", txn.getTransactionDate());
            recentTxns.add(txnMap);
        }
        profile.put("recentTransactions", recentTxns);

        return profile;
    }
}
