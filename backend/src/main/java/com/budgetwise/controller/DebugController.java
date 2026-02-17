/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @org.springframework.security.access.prepost.PreAuthorize("permitAll()")
    @GetMapping("/categories")
    public List<Map<String, Object>> getCategories() {
        return jdbcTemplate
                .queryForList("SELECT id, name, category_type, is_system FROM categories ORDER BY category_type, name");
    }
}
