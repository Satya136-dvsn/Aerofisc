/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.dto;

import java.util.Map;

public class ExportRequest {
    private String format;
    private String timeRange;
    private Map<String, String> images;

    public ExportRequest() {
    }

    public ExportRequest(String format, String timeRange, Map<String, String> images) {
        this.format = format;
        this.timeRange = timeRange;
        this.images = images;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getTimeRange() {
        return timeRange;
    }

    public void setTimeRange(String timeRange) {
        this.timeRange = timeRange;
    }

    public Map<String, String> getImages() {
        return images;
    }

    public void setImages(Map<String, String> images) {
        this.images = images;
    }
}
