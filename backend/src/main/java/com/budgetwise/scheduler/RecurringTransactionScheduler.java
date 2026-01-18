package com.budgetwise.scheduler;

import com.budgetwise.service.RecurringTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduler for processing recurring transactions
 * Runs daily at 1:00 AM to create transactions for due recurring entries
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RecurringTransactionScheduler {

    private final RecurringTransactionService recurringTransactionService;

    /**
     * Process recurring transactions daily at 1:00 AM
     */
    @Scheduled(cron = "0 0 1 * * *")
    public void processRecurringTransactions() {
        log.info("Starting scheduled recurring transaction processing...");

        try {
            int processed = recurringTransactionService.processDueRecurringTransactions();
            log.info("Scheduled recurring transaction processing complete. Processed: {}", processed);
        } catch (Exception e) {
            log.error("Error during scheduled recurring transaction processing: {}", e.getMessage(), e);
        }
    }

    /**
     * Also run at application startup if there are due transactions
     * This ensures transactions aren't missed if the app was down
     */
    @Scheduled(initialDelay = 60000, fixedDelay = Long.MAX_VALUE) // Run once after 1 minute
    public void processRecurringTransactionsOnStartup() {
        log.info("Checking for due recurring transactions after startup...");

        try {
            int processed = recurringTransactionService.processDueRecurringTransactions();
            if (processed > 0) {
                log.info("Startup processing complete. Processed {} overdue recurring transactions", processed);
            }
        } catch (Exception e) {
            log.error("Error during startup recurring transaction processing: {}", e.getMessage(), e);
        }
    }
}
