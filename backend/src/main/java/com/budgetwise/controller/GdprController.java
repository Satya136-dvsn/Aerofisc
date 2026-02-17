/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.service.ExportService;
import com.budgetwise.service.UserService;
import com.budgetwise.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/gdpr")
@Tag(name = "GDPR Compliance", description = "Endpoints for data export and account deletion")
public class GdprController {

    private final ExportService exportService;
    private final UserService userService;

    public GdprController(ExportService exportService, UserService userService) {
        this.exportService = exportService;
        this.userService = userService;
    }

    @GetMapping("/export")
    @Operation(summary = "Export all user data", description = "Download all user data in JSON format for GDPR portability")
    public ResponseEntity<byte[]> exportAllData(@AuthenticationPrincipal UserPrincipal userPrincipal)
            throws IOException {
        byte[] data = exportService.exportAllDataJSON(userPrincipal.getId());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=budgetwise_data_export.json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(data);
    }

    @DeleteMapping("/account")
    @Operation(summary = "Delete user account", description = "Permanently delete user account and all associated data")
    public ResponseEntity<Map<String, String>> deleteAccount(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> request) {

        String password = request.get("password");
        if (password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
        }

        userService.deleteUserAccount(userPrincipal.getId(), password);

        return ResponseEntity.ok(Map.of("message", "Account successfully deleted"));
    }
}
