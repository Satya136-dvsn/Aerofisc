/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.ChatResponseDto;
import com.budgetwise.entity.Transaction;
import com.budgetwise.entity.UserProfile;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatAssistantService {

    private final GeminiService geminiService;
    private final TransactionRepository transactionRepository;
    private final UserProfileRepository userProfileRepository;

    public ChatAssistantService(GeminiService geminiService, TransactionRepository transactionRepository,
            UserProfileRepository userProfileRepository) {
        this.geminiService = geminiService;
        this.transactionRepository = transactionRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public ChatResponseDto chat(String message, String conversationId, Long userId) {
        if (conversationId == null) {
            conversationId = UUID.randomUUID().toString();
        }

        // 1. Gather Context
        String financialContext = buildFinancialContext(userId);

        // 2. Construct Prompt
        String prompt = String.format(
                "You are a helpful financial assistant named BudgetWise AI. " +
                        "Here is the user's current financial context:\n%s\n\n" +
                        "User Question: %s\n\n" +
                        "Provide a helpful, concise, and encouraging response based on the context. " +
                        "If the context doesn't have the answer, give general financial advice.",
                financialContext, message);

        // 3. Call AI
        String aiResponse = geminiService.generateContent(prompt);

        return ChatResponseDto.builder()
                .response(aiResponse)
                .conversationId(conversationId)
                .build();
    }

    private String buildFinancialContext(Long userId) {
        StringBuilder context = new StringBuilder();

        // Profile
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        if (profile != null) {
            context.append("Monthly Income: ").append(profile.getMonthlyIncome()).append("\n");
            context.append("Savings Target: ").append(profile.getSavingsTarget()).append("\n");
            context.append("Currency: ").append(profile.getCurrency()).append("\n");
        }

        // Recent Transactions (Last 5)
        List<Transaction> recentTxns = transactionRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().limit(5).collect(Collectors.toList());

        if (!recentTxns.isEmpty()) {
            context.append("Recent Transactions:\n");
            for (Transaction t : recentTxns) {
                context.append("- ").append(t.getDescription())
                        .append(": ").append(t.getAmount())
                        .append(" (").append(t.getType()).append(")\n");
            }
        }

        // Monthly Summary (Simplified)
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        List<Transaction> monthlyTxns = transactionRepository.findByUserIdAndTransactionDateBetween(userId,
                startOfMonth, endOfMonth);

        BigDecimal totalExpense = monthlyTxns.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        context.append("Total Expenses this Month: ").append(totalExpense).append("\n");

        return context.toString();
    }
}
