/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.dto.SessionDto;
import com.budgetwise.entity.RefreshToken;
import com.budgetwise.security.UserPrincipal;
import com.budgetwise.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final RefreshTokenService refreshTokenService;

    public SessionController(RefreshTokenService refreshTokenService) {
        this.refreshTokenService = refreshTokenService;
    }

    @GetMapping
    public ResponseEntity<List<SessionDto>> getActiveSessions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<RefreshToken> tokens = refreshTokenService.getAllTokensForUser(userPrincipal.getId());

        List<SessionDto> sessions = tokens.stream()
                .map(token -> SessionDto.builder()
                        .id(token.getId())
                        .createdAt(token.getExpiryDate().minusMillis(604800000L)) // Approximate creation time
                        .expiresAt(token.getExpiryDate())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(sessions);
    }

    @DeleteMapping("/{tokenId}")
    public ResponseEntity<Void> revokeSession(
            @PathVariable Long tokenId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        refreshTokenService.revokeToken(tokenId, userPrincipal.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> revokeAllOtherSessions(
            @RequestHeader("Authorization") String authHeader,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        // Extract current token from Authorization header
        String currentToken = authHeader.substring(7); // Remove "Bearer " prefix
        refreshTokenService.revokeAllExceptCurrent(userPrincipal.getId(), currentToken);
        return ResponseEntity.ok().build();
    }
}
