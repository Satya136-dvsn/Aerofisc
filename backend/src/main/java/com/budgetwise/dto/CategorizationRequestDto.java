/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

public class CategorizationRequestDto {
    private String description;
    private String merchantName;

    public CategorizationRequestDto() {
    }

    public CategorizationRequestDto(String description, String merchantName) {
        this.description = description;
        this.merchantName = merchantName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public static CategorizationRequestDtoBuilder builder() {
        return new CategorizationRequestDtoBuilder();
    }

    public static class CategorizationRequestDtoBuilder {
        private String description;
        private String merchantName;

        public CategorizationRequestDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CategorizationRequestDtoBuilder merchantName(String merchantName) {
            this.merchantName = merchantName;
            return this;
        }

        public CategorizationRequestDto build() {
            return new CategorizationRequestDto(description, merchantName);
        }
    }
}
