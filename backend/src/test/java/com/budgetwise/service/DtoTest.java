/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.CategoryBreakdownDto;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class DtoTest {
    @Test
    void testDto() {
        CategoryBreakdownDto dto = CategoryBreakdownDto.builder()
                .categoryId(1L)
                .categoryName("Food")
                .amount(new BigDecimal("1000"))
                .percentage(50.0)
                .transactionCount(10)
                .build();
        assertNotNull(dto);
    }
}
