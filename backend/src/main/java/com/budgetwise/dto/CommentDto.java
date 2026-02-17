/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.time.LocalDateTime;

public class CommentDto {
    private Long id;
    private Long postId;
    private Long userId;
    private String content;
    private Integer likeCount;
    private LocalDateTime createdAt;

    public CommentDto() {
    }

    public CommentDto(Long id, Long postId, Long userId, String content, Integer likeCount, LocalDateTime createdAt) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.content = content;
        this.likeCount = likeCount;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static CommentDtoBuilder builder() {
        return new CommentDtoBuilder();
    }

    public static class CommentDtoBuilder {
        private Long id;
        private Long postId;
        private Long userId;
        private String content;
        private Integer likeCount;
        private LocalDateTime createdAt;

        public CommentDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CommentDtoBuilder postId(Long postId) {
            this.postId = postId;
            return this;
        }

        public CommentDtoBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public CommentDtoBuilder content(String content) {
            this.content = content;
            return this;
        }

        public CommentDtoBuilder likeCount(Integer likeCount) {
            this.likeCount = likeCount;
            return this;
        }

        public CommentDtoBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public CommentDto build() {
            return new CommentDto(id, postId, userId, content, likeCount, createdAt);
        }
    }
}
