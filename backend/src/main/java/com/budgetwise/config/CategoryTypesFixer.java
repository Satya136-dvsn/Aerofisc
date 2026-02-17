/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class CategoryTypesFixer {

        private static final Logger logger = LoggerFactory.getLogger(CategoryTypesFixer.class);

        @Autowired
        private JdbcTemplate jdbcTemplate;

        @EventListener(ApplicationReadyEvent.class)
        public void fixCategoryTypes() {
                try {
                        logger.info("Checking and fixing category types...");

                        // 1. First, mark EVERYTHING as EXPENSE by default
                        String resetUpdate = "UPDATE categories SET category_type = 'EXPENSE'";
                        int resetCount = jdbcTemplate.update(resetUpdate);
                        logger.info("Reset {} categories to EXPENSE", resetCount);

                        // 2. Then, explicitly mark known INCOME categories
                        // NARROWED LIST: Only strictly "Income" types.
                        // 'Investments', 'Freelance', 'Refunds', 'Gifts Received' are now treated as
                        // EXPENSE (or money in/out flow that can be budgeted).
                        String incomeUpdate = "UPDATE categories SET category_type = 'INCOME' " +
                                        "WHERE LOWER(name) IN (" +
                                        "'salary', 'wages', 'business', 'business income', " +
                                        "'rental income', 'other income'" +
                                        ")";

                        int incomeCount = jdbcTemplate.update(incomeUpdate);

                        // Get final counts
                        Integer expenseTotal = jdbcTemplate.queryForObject(
                                        "SELECT COUNT(*) FROM categories WHERE category_type = 'EXPENSE'",
                                        Integer.class);
                        Integer incomeTotal = jdbcTemplate.queryForObject(
                                        "SELECT COUNT(*) FROM categories WHERE category_type = 'INCOME'",
                                        Integer.class);

                        logger.info("Category types fixed successfully!");
                        logger.info("Updated {} categories to INCOME type", incomeCount);
                        logger.info("Total EXPENSE categories: {}", expenseTotal);
                        logger.info("Total INCOME categories: {}", incomeTotal);

                } catch (Exception e) {
                        logger.error("Error fixing category types: {}", e.getMessage(), e);
                }
        }
}
