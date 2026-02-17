/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ReportDto {

    public static class ScheduledReportDto {
        private Long id;
        private String name;
        private String frequency; // Weekly, Monthly, Quarterly
        private String nextRun;
        private String recipients;
        private String status; // Active, Paused
        private String reportType;
        private String configuration;

        public ScheduledReportDto() {
        }

        public ScheduledReportDto(Long id, String name, String frequency, String nextRun, String recipients,
                String status, String reportType, String configuration) {
            this.id = id;
            this.name = name;
            this.frequency = frequency;
            this.nextRun = nextRun;
            this.recipients = recipients;
            this.status = status;
            this.reportType = reportType;
            this.configuration = configuration;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getFrequency() {
            return frequency;
        }

        public void setFrequency(String frequency) {
            this.frequency = frequency;
        }

        public String getNextRun() {
            return nextRun;
        }

        public void setNextRun(String nextRun) {
            this.nextRun = nextRun;
        }

        public String getRecipients() {
            return recipients;
        }

        public void setRecipients(String recipients) {
            this.recipients = recipients;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
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

        public static ScheduledReportDtoBuilder builder() {
            return new ScheduledReportDtoBuilder();
        }

        public static class ScheduledReportDtoBuilder {
            private Long id;
            private String name;
            private String frequency;
            private String nextRun;
            private String recipients;
            private String status;
            private String reportType;
            private String configuration;

            public ScheduledReportDtoBuilder id(Long id) {
                this.id = id;
                return this;
            }

            public ScheduledReportDtoBuilder name(String name) {
                this.name = name;
                return this;
            }

            public ScheduledReportDtoBuilder frequency(String frequency) {
                this.frequency = frequency;
                return this;
            }

            public ScheduledReportDtoBuilder nextRun(String nextRun) {
                this.nextRun = nextRun;
                return this;
            }

            public ScheduledReportDtoBuilder recipients(String recipients) {
                this.recipients = recipients;
                return this;
            }

            public ScheduledReportDtoBuilder status(String status) {
                this.status = status;
                return this;
            }

            public ScheduledReportDtoBuilder reportType(String reportType) {
                this.reportType = reportType;
                return this;
            }

            public ScheduledReportDtoBuilder configuration(String configuration) {
                this.configuration = configuration;
                return this;
            }

            public ScheduledReportDto build() {
                return new ScheduledReportDto(id, name, frequency, nextRun, recipients, status, reportType,
                        configuration);
            }
        }
    }

    public static class CustomReportConfig {
        private String name;
        private String dateRange; // this_month, last_month, last_quarter, last_year, custom
        private Map<String, Boolean> metrics; // income, expenses, savings, budgets, goals
        private boolean preview;

        public CustomReportConfig() {
        }

        public CustomReportConfig(String name, String dateRange, Map<String, Boolean> metrics, boolean preview) {
            this.name = name;
            this.dateRange = dateRange;
            this.metrics = metrics;
            this.preview = preview;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDateRange() {
            return dateRange;
        }

        public void setDateRange(String dateRange) {
            this.dateRange = dateRange;
        }

        public Map<String, Boolean> getMetrics() {
            return metrics;
        }

        public void setMetrics(Map<String, Boolean> metrics) {
            this.metrics = metrics;
        }

        public boolean isPreview() {
            return preview;
        }

        public void setPreview(boolean preview) {
            this.preview = preview;
        }

        public static CustomReportConfigBuilder builder() {
            return new CustomReportConfigBuilder();
        }

        public static class CustomReportConfigBuilder {
            private String name;
            private String dateRange;
            private Map<String, Boolean> metrics;
            private boolean preview;

            public CustomReportConfigBuilder name(String name) {
                this.name = name;
                return this;
            }

            public CustomReportConfigBuilder dateRange(String dateRange) {
                this.dateRange = dateRange;
                return this;
            }

            public CustomReportConfigBuilder metrics(Map<String, Boolean> metrics) {
                this.metrics = metrics;
                return this;
            }

            public CustomReportConfigBuilder preview(boolean preview) {
                this.preview = preview;
                return this;
            }

            public CustomReportConfig build() {
                return new CustomReportConfig(name, dateRange, metrics, preview);
            }
        }
    }
}
