/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.controller;

import com.budgetwise.security.UserPrincipal;
import com.budgetwise.service.ExportService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ExportController.class);

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/transactions")
    public ResponseEntity<byte[]> exportTransactions(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "csv") String format) throws java.io.IOException {

        byte[] data;
        String filename;
        MediaType mediaType;

        switch (format.toLowerCase()) {
            case "excel":
                data = exportService.exportTransactionsExcel(userPrincipal.getId(), startDate, endDate);
                filename = "transactions.xlsx";
                mediaType = MediaType
                        .parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                break;
            case "pdf":
                data = exportService.exportTransactionsPDF(userPrincipal.getId(), startDate, endDate);
                filename = "transactions.pdf";
                mediaType = MediaType.APPLICATION_PDF;
                break;
            case "csv":
            default:
                data = exportService.exportTransactionsCSV(userPrincipal.getId(), startDate, endDate);
                filename = "transactions.csv";
                mediaType = MediaType.parseMediaType("text/csv");
                break;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDispositionFormData("attachment", filename);

        return ResponseEntity.ok()
                .headers(headers)
                .body(data);
    }

    @GetMapping("/all-data")
    public ResponseEntity<byte[]> exportAllData(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "csv") String format) throws java.io.IOException {

        byte[] data;
        String filename;
        MediaType mediaType;

        switch (format.toLowerCase()) {
            case "excel":
                data = exportService.exportAllDataExcel(userPrincipal.getId());
                filename = "budgetwise-data.xlsx";
                mediaType = MediaType
                        .parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                break;
            case "pdf":
                data = exportService.exportAllDataPDF(userPrincipal.getId());
                filename = "budgetwise-data.pdf";
                mediaType = MediaType.APPLICATION_PDF;
                break;
            case "csv":
            default:
                data = exportService.exportAllDataCSV(userPrincipal.getId());
                filename = "budgetwise-data.csv";
                mediaType = MediaType.parseMediaType("text/csv");
                break;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDispositionFormData("attachment", filename);

        return ResponseEntity.ok()
                .headers(headers)
                .body(data);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<byte[]> exportDashboard(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "excel") String format) {

        System.out.println("ExportController: Received dashboard export request. Format: " + format + ", User: "
                + (userPrincipal != null ? userPrincipal.getUsername() : "null"));

        try {
            byte[] data;
            String filename;
            MediaType mediaType;

            switch (format.toLowerCase()) {
                case "excel":
                    data = exportService.exportDashboardExcel(userPrincipal.getId());
                    filename = "dashboard.xlsx";
                    mediaType = MediaType
                            .parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                    break;
                case "pdf":
                    System.out.println("ExportController: Starting PDF generation...");
                    data = exportService.exportDashboardPDF(userPrincipal.getId());
                    System.out.println(
                            "ExportController: PDF generation successful. Size: " + (data != null ? data.length : 0));
                    filename = "dashboard.pdf";
                    mediaType = MediaType.APPLICATION_PDF;
                    break;
                default:
                    throw new IllegalArgumentException("Dashboard export only supports Excel and PDF formats");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(mediaType);
            headers.setContentDispositionFormData("attachment", filename);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(data);
        } catch (Exception e) {
            logger.error("ExportController: Error during export", e);
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/budgets")
    public ResponseEntity<byte[]> exportBudgets(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "excel") String format) throws java.io.IOException {

        byte[] data;
        String filename;
        MediaType mediaType;

        switch (format.toLowerCase()) {
            case "excel":
                data = exportService.exportBudgetsExcel(userPrincipal.getId());
                filename = "budgets.xlsx";
                mediaType = MediaType
                        .parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                break;
            case "pdf":
                data = exportService.exportBudgetsPDF(userPrincipal.getId());
                filename = "budgets.pdf";
                mediaType = MediaType.APPLICATION_PDF;
                break;
            default:
                throw new IllegalArgumentException("Budgets export only supports Excel and PDF formats");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDispositionFormData("attachment", filename);

        return ResponseEntity.ok()
                .headers(headers)
                .body(data);
    }

    @GetMapping("/analytics")
    public ResponseEntity<byte[]> exportAnalytics(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "3M") String timeRange,
            @RequestParam(defaultValue = "excel") String format) throws java.io.IOException {

        byte[] data;
        String filename;
        MediaType mediaType;

        switch (format.toLowerCase()) {
            case "excel":
                data = exportService.exportAnalyticsExcel(userPrincipal.getId(), timeRange);
                filename = "analytics_" + timeRange + ".xlsx";
                mediaType = MediaType
                        .parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                break;
            case "pdf":
                data = exportService.exportAnalyticsPDF(userPrincipal.getId(), timeRange);
                filename = "analytics_" + timeRange + ".pdf";
                mediaType = MediaType.APPLICATION_PDF;
                break;
            default:
                throw new IllegalArgumentException("Analytics export only supports Excel and PDF formats");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDispositionFormData("attachment", filename);

        return ResponseEntity.ok()
                .headers(headers)
                .body(data);
    }

    @GetMapping("/goals")
    public ResponseEntity<byte[]> exportGoals(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "excel") String format) throws java.io.IOException {

        byte[] data;
        String filename;
        MediaType mediaType;

        switch (format.toLowerCase()) {
            case "excel":
                data = exportService.exportGoalsExcel(userPrincipal.getId());
                filename = "savings-goals.xlsx";
                mediaType = MediaType
                        .parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                break;
            case "pdf":
                data = exportService.exportGoalsPDF(userPrincipal.getId());
                filename = "savings-goals.pdf";
                mediaType = MediaType.APPLICATION_PDF;
                break;
            default:
                throw new IllegalArgumentException("Goals export only supports Excel and PDF formats");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDispositionFormData("attachment", filename);

        return ResponseEntity.ok()
                .headers(headers)
                .body(data);
    }
}
