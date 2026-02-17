/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class PostDto {
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String tags;
    private Integer likeCount;
    private Integer commentCount;
    private Long userId;
    private String userName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isLiked;

    public PostDto() {
    }

    public PostDto(Long id, String title, String content, String tags, Integer likeCount, Integer commentCount,
            Long userId, String userName, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isLiked) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.userId = userId;
        this.userName = userName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isLiked = isLiked;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Integer getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getIsLiked() {
        return isLiked;
    }

    public void setIsLiked(Boolean isLiked) {
        this.isLiked = isLiked;
    }

    public static PostDtoBuilder builder() {
        return new PostDtoBuilder();
    }

    public static class PostDtoBuilder {
        private Long id;
        private String title;
        private String content;
        private String tags;
        private Integer likeCount;
        private Integer commentCount;
        private Long userId;
        private String userName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Boolean isLiked;

        public PostDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PostDtoBuilder title(String title) {
            this.title = title;
            return this;
        }

        public PostDtoBuilder content(String content) {
            this.content = content;
            return this;
        }

        public PostDtoBuilder tags(String tags) {
            this.tags = tags;
            return this;
        }

        public PostDtoBuilder likeCount(Integer likeCount) {
            this.likeCount = likeCount;
            return this;
        }

        public PostDtoBuilder commentCount(Integer commentCount) {
            this.commentCount = commentCount;
            return this;
        }

        public PostDtoBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public PostDtoBuilder userName(String userName) {
            this.userName = userName;
            return this;
        }

        public PostDtoBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PostDtoBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public PostDtoBuilder isLiked(Boolean isLiked) {
            this.isLiked = isLiked;
            return this;
        }

        public PostDto build() {
            return new PostDto(id, title, content, tags, likeCount, commentCount, userId, userName, createdAt,
                    updatedAt, isLiked);
        }
    }
}
