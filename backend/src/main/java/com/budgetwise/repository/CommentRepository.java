/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.repository;

import com.budgetwise.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);

    Page<Comment> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);

    void deleteByUserId(Long userId);

    void deleteByPostIdIn(List<Long> postIds);

    List<Comment> findByUserId(Long userId);
}
