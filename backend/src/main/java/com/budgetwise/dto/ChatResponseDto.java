/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

public class ChatResponseDto {
    private String response;
    private String conversationId;
    private String context;

    public ChatResponseDto() {
    }

    public ChatResponseDto(String response, String conversationId, String context) {
        this.response = response;
        this.conversationId = conversationId;
        this.context = context;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public static ChatResponseDtoBuilder builder() {
        return new ChatResponseDtoBuilder();
    }

    public static class ChatResponseDtoBuilder {
        private String response;
        private String conversationId;
        private String context;

        public ChatResponseDtoBuilder response(String response) {
            this.response = response;
            return this;
        }

        public ChatResponseDtoBuilder conversationId(String conversationId) {
            this.conversationId = conversationId;
            return this;
        }

        public ChatResponseDtoBuilder context(String context) {
            this.context = context;
            return this;
        }

        public ChatResponseDto build() {
            return new ChatResponseDto(response, conversationId, context);
        }
    }
}
