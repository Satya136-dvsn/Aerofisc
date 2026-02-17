/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.repository;

import com.budgetwise.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserIdAndPostIdAndCommentIdIsNull(Long userId, Long postId);

    Optional<Like> findByUserIdAndCommentId(Long userId, Long commentId);

    void deleteByUserIdAndPostIdAndCommentIdIsNull(Long userId, Long postId);

    void deleteByUserIdAndCommentId(Long userId, Long commentId);

    Integer countByPostIdAndCommentIdIsNull(Long postId);

    Integer countByCommentId(Long commentId);

    void deleteByUserId(Long userId);

    void deleteByPostIdIn(List<Long> postIds);

    void deleteByCommentIdIn(List<Long> commentIds);
}
