/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scheduled_reports")
public class ScheduledReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String reportName;

    @Column(nullable = false)
    private String reportType; // "TEMPLATE" or "CUSTOM"

    @Column(columnDefinition = "TEXT")
    private String configuration; // JSON string storing templateId or custom config

    @Column(nullable = false)
    private String frequency; // "WEEKLY", "MONTHLY", "QUARTERLY"

    private LocalDateTime nextRun;

    @Column(nullable = false)
    private String recipients;

    @Column(nullable = false)
    private boolean active = true;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public ScheduledReport() {
    }

    public ScheduledReport(Long id, Long userId, String reportName, String reportType, String configuration,
            String frequency, LocalDateTime nextRun, String recipients, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.reportName = reportName;
        this.reportType = reportType;
        this.configuration = configuration;
        this.frequency = frequency;
        this.nextRun = nextRun;
        this.recipients = recipients;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getConfiguration() {
        return configuration;
    }

    public void setConfiguration(String configuration) {
        this.configuration = configuration;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public LocalDateTime getNextRun() {
        return nextRun;
    }

    public void setNextRun(LocalDateTime nextRun) {
        this.nextRun = nextRun;
    }

    public String getRecipients() {
        return recipients;
    }

    public void setRecipients(String recipients) {
        this.recipients = recipients;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static ScheduledReportBuilder builder() {
        return new ScheduledReportBuilder();
    }

    public static class ScheduledReportBuilder {
        private Long id;
        private Long userId;
        private String reportName;
        private String reportType;
        private String configuration;
        private String frequency;
        private LocalDateTime nextRun;
        private String recipients;
        private boolean active;
        private LocalDateTime createdAt;

        public ScheduledReportBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ScheduledReportBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public ScheduledReportBuilder reportName(String reportName) {
            this.reportName = reportName;
            return this;
        }

        public ScheduledReportBuilder reportType(String reportType) {
            this.reportType = reportType;
            return this;
        }

        public ScheduledReportBuilder configuration(String configuration) {
            this.configuration = configuration;
            return this;
        }

        public ScheduledReportBuilder frequency(String frequency) {
            this.frequency = frequency;
            return this;
        }

        public ScheduledReportBuilder nextRun(LocalDateTime nextRun) {
            this.nextRun = nextRun;
            return this;
        }

        public ScheduledReportBuilder recipients(String recipients) {
            this.recipients = recipients;
            return this;
        }

        public ScheduledReportBuilder active(boolean active) {
            this.active = active;
            return this;
        }

        public ScheduledReportBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ScheduledReport build() {
            return new ScheduledReport(id, userId, reportName, reportType, configuration, frequency, nextRun,
                    recipients, active, createdAt);
        }
    }
}
