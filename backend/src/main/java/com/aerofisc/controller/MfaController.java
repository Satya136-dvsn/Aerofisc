/*
 * Â© 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.aerofisc.controller;

import com.aerofisc.dto.MfaSetupResponse;
import com.aerofisc.dto.MfaVerificationRequest;
import com.aerofisc.entity.User;
import com.aerofisc.repository.UserRepository;
import com.aerofisc.security.UserPrincipal;
import com.aerofisc.service.MfaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mfa")
public class MfaController {

    private final MfaService mfaService;
    private final UserRepository userRepository;

    public MfaController(MfaService mfaService, UserRepository userRepository) {
        this.mfaService = mfaService;
        this.userRepository = userRepository;
    }

    @PostMapping("/setup")
    public ResponseEntity<MfaSetupResponse> setupMfa(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String secret = mfaService.generateSecret();
        // Temporarily store secret or just return it?
        // Better to return it and only save when verified.
        // But for simplicity, we can return it and client sends it back for
        // verification.

        String qrCodeUrl = mfaService.getQrCodeUrl(secret, user.getEmail());

        return ResponseEntity.ok(new MfaSetupResponse(secret, qrCodeUrl));
    }

    @PostMapping("/enable")
    public ResponseEntity<Void> enableMfa(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody MfaVerificationRequest request) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (mfaService.verifyCode(request.getSecret(), request.getCode())) {
            user.setMfaSecret(request.getSecret());
            user.setIsMfaEnabled(true);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/disable")
    public ResponseEntity<Void> disableMfa(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsMfaEnabled(false);
        user.setMfaSecret(null);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}


