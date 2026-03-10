/*
 * Â© 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.aerofisc.controller;

import com.aerofisc.dto.*;
import com.aerofisc.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-mfa")
    public ResponseEntity<AuthResponse> verifyMfa(@RequestBody com.aerofisc.dto.MfaVerificationRequest request) {
        // We expect preAuthToken in the secret field of MfaVerificationRequest for
        // simplicity,
        // or we should create a new DTO. Let's assume the client sends the token as
        // 'secret' for now
        // OR better, create a specific DTO.
        // Let's reuse MfaVerificationRequest but treat 'secret' as 'token'.
        AuthResponse response = authService.verifyMfa(request.getSecret(), request.getCode());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth endpoint is working!");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        // Generates token and returns it in the response (simulate email sending)
        String resetToken = authService.requestPasswordReset(request.getEmail());

        // IMPORTANT: In a real app, do NOT return the token. Email it via an SMTP
        // service.
        // We are returning it in a demo JSON object so the UI flow can be tested.
        return ResponseEntity.ok(java.util.Map.of(
                "message", "Password reset email sent (check response for token)",
                "demoToken", resetToken));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(java.util.Map.of(
                "message", "Password reconstructed successfully. You may now log in."));
    }
}
