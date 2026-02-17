/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.entity.RefreshToken;
import com.budgetwise.entity.User;
import com.budgetwise.repository.RefreshTokenRepository;
import com.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${jwt.refresh-expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId).get();

        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(new RefreshToken());

        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public RefreshToken rotateRefreshToken(RefreshToken oldToken) {
        // Delete old token and create new one
        refreshTokenRepository.delete(oldToken);
        return createRefreshToken(oldToken.getUser().getId());
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException(
                    token.getToken() + " Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public int deleteByUserId(Long userId) {
        return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }

    public java.util.List<RefreshToken> getAllTokensForUser(Long userId) {
        User user = userRepository.findById(userId).get();
        return refreshTokenRepository.findAll().stream()
                .filter(token -> token.getUser().getId().equals(userId))
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public void revokeToken(Long tokenId, Long userId) {
        RefreshToken token = refreshTokenRepository.findById(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        if (!token.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to revoke this token");
        }

        refreshTokenRepository.delete(token);
    }

    @Transactional
    public void revokeAllExceptCurrent(Long userId, String currentAccessToken) {
        User user = userRepository.findById(userId).get();

        // Get all tokens for this user
        java.util.List<RefreshToken> allTokens = refreshTokenRepository.findAll().stream()
                .filter(token -> token.getUser().getId().equals(userId))
                .collect(java.util.stream.Collectors.toList());

        // Delete all tokens (in this simplified version, we delete all and user needs
        // to login again with current session)
        for (RefreshToken token : allTokens) {
            if (!token.getToken().equals(currentAccessToken)) {
                refreshTokenRepository.delete(token);
            }
        }
    }
}
