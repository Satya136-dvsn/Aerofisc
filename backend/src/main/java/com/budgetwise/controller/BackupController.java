/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.security.UserPrincipal;
import com.budgetwise.service.ExportService;
import com.budgetwise.service.GoogleDriveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/backup")
public class BackupController {

    private final ExportService exportService;
    private final GoogleDriveService googleDriveService;

    public BackupController(ExportService exportService, GoogleDriveService googleDriveService) {
        System.out.println("DEBUG: BackupController Initializing...");
        this.exportService = exportService;
        this.googleDriveService = googleDriveService;
    }

    @GetMapping("/auth-url")
    public ResponseEntity<?> getAuthUrl() {
        try {
            String url = googleDriveService.getAuthorizationUrl();
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate auth URL: " + e.getMessage()));
        }
    }

    @GetMapping("/oauth2/callback")
    public ResponseEntity<?> handleCallback(@RequestParam("code") String code,
            @RequestParam(value = "state", required = false) String state) {
        // In a real app, 'state' should contain the userId to link the token.
        // For this simple implementation, we assume a single user flow or need a way to
        // identify the user.
        // Since this is a callback from Google, we don't have the Authorization header.
        // WORKAROUND: We will store the token with a temporary ID or fixed ID for the
        // admin/primary user
        // OR we redirect to a frontend page that calls an authenticated endpoint to
        // link the token.

        // Better approach for Showcase:
        // 1. Frontend calls /auth-url, gets URL.
        // 2. User clicks, goes to Google.
        // 3. Google redirects to Backend /callback.
        // 4. Backend exchanges code, but needs to know WHO the user is.
        // - We can't easily know the user here without a session cookie or 'state'
        // param.
        // - We will use a fixed ID "admin" or "1" for this demo if state is missing.

        try {
            // For simplicity in this demo, we'll use a hardcoded ID or try to parse state
            // if we sent it.
            String userId = "5"; // Hardcoded to the test user ID for now, or use "default"
            if (state != null && !state.isEmpty()) {
                userId = state;
            }

            googleDriveService.exchangeCodeForToken(code, userId);
            return ResponseEntity.ok("Google Drive connected successfully! You can close this window.");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to connect Google Drive: " + e.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            boolean isConnected = googleDriveService.isUserAuthenticated(String.valueOf(userPrincipal.getId()));
            return ResponseEntity.ok(Map.of("isConnected", isConnected));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadBackup(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            String userId = String.valueOf(userPrincipal.getId());
            if (!googleDriveService.isUserAuthenticated(userId)) {
                // Return 401 or specific error to trigger frontend to ask for auth
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Google Drive not connected", "action", "connect_google_drive"));
            }

            byte[] data = exportService.exportAllDataJSON(userPrincipal.getId());
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "budgetwise_backup_" + userPrincipal.getId() + "_" + timestamp + ".json";

            String result = googleDriveService.uploadBackup(data, filename, userId);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
