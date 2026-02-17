/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class CategoryFixController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PreAuthorize("permitAll()")
    @PostMapping("/fix-category-types")
    public Map<String, Object> fixCategoryTypes() {
        Map<String, Object> result = new HashMap<>();

        try {
            // Mark common expense categories as EXPENSE
            String expenseUpdate = "UPDATE categories SET category_type = 'EXPENSE' " +
                    "WHERE LOWER(name) IN (" +
                    "'food', 'groceries', 'dining', 'restaurants', " +
                    "'transport', 'transportation', 'fuel', 'gas', 'car', " +
                    "'shopping', 'clothes', 'clothing', 'fashion', " +
                    "'utilities', 'electricity', 'water', 'internet', " +
                    "'entertainment', 'movies', 'games', " +
                    "'health', 'healthcare', 'medical', 'pharmacy', " +
                    "'education', 'books', 'courses', " +
                    "'housing', 'rent', 'mortgage', " +
                    "'insurance', " +
                    "'subscriptions', 'netflix', 'spotify', " +
                    "'personal care', 'beauty', " +
                    "'travel', 'vacation', 'hotel', " +
                    "'gifts', 'donations', " +
                    "'misc', 'miscellaneous', 'other', 'others'" +
                    ")";

            int expenseCount = jdbcTemplate.update(expenseUpdate);

            // Mark income categories as INCOME
            String incomeUpdate = "UPDATE categories SET category_type = 'INCOME' " +
                    "WHERE LOWER(name) IN (" +
                    "'salary', 'wages', 'income', 'earnings', " +
                    "'bonus', 'freelance', 'business', " +
                    "'investment', 'interest', 'dividend', " +
                    "'refund', 'gift received'" +
                    ") AND category_type != 'EXPENSE'";

            int incomeCount = jdbcTemplate.update(incomeUpdate);

            // Get counts
            Integer expenseTotal = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM categories WHERE category_type = 'EXPENSE'",
                    Integer.class);
            Integer incomeTotal = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM categories WHERE category_type = 'INCOME'",
                    Integer.class);

            result.put("success", true);
            result.put("message", "Category types updated successfully");
            result.put("expenseUpdated", expenseCount);
            result.put("incomeUpdated", incomeCount);
            result.put("totalExpenseCategories", expenseTotal);
            result.put("totalIncomeCategories", incomeTotal);

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error: " + e.getMessage());
        }

        return result;
    }
}
