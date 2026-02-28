/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.Aerofisc.controller;

import com.Aerofisc.entity.AuditLog;
import com.Aerofisc.security.UserPrincipal;
import com.Aerofisc.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditLogService auditLogService;

    public AuditController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/my-logs")
    public ResponseEntity<List<AuditLog>> getMyLogs(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(auditLogService.getLogsByUserId(userPrincipal.getId()));
    }

    @GetMapping("/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }
}

