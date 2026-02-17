/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.entity.Category;
import com.budgetwise.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cleanup")
public class CleanupController {

    private final CategoryRepository categoryRepository;

    public CleanupController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @DeleteMapping("/error-categories")
    public ResponseEntity<String> deleteErrorCategories() {
        List<Category> errorCategories = categoryRepository.findAll().stream()
                .filter(c -> c.getName().toLowerCase().contains("error from ai service"))
                .collect(Collectors.toList());

        if (errorCategories.isEmpty()) {
            return ResponseEntity.ok("No error categories found.");
        }

        int count = errorCategories.size();
        categoryRepository.deleteAll(errorCategories);

        return ResponseEntity.ok("Successfully deleted " + count + " error categories.");
    }
}
