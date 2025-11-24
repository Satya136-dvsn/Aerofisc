package com.budgetwise.dto;

import lombok.Data;
import java.util.Map;

@Data
public class ExportRequest {
    private String format;
    private String timeRange;
}
