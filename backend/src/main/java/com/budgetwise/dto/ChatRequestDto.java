/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

public class ChatRequestDto {
    private String message;
    private String conversationId;

    public ChatRequestDto() {
    }

    public ChatRequestDto(String message, String conversationId) {
        this.message = message;
        this.conversationId = conversationId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public static ChatRequestDtoBuilder builder() {
        return new ChatRequestDtoBuilder();
    }

    public static class ChatRequestDtoBuilder {
        private String message;
        private String conversationId;

        public ChatRequestDtoBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ChatRequestDtoBuilder conversationId(String conversationId) {
            this.conversationId = conversationId;
            return this;
        }

        public ChatRequestDto build() {
            return new ChatRequestDto(message, conversationId);
        }
    }
}
