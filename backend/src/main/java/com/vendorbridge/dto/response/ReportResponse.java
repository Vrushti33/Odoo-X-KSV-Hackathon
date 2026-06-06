package com.vendorbridge.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ReportResponse {
    private BigDecimal totalRFQValue;
    private BigDecimal totalQuotationValue;
    private BigDecimal approvedValue;
    private BigDecimal poValue;
    
    private List<StatusCount> rfqStatusData;
    private List<StatusCount> approvalStatusData;
    private List<TrendData> trendData;
    
    private long totalRFQs;
    private long totalQuotations;
    private long totalApprovals;
    private long totalPOs;

    @Data
    @Builder
    public static class StatusCount {
        private String name;
        private long value;
    }

    @Data
    @Builder
    public static class TrendData {
        private String month;
        private long rfqs;
        private long quotations;
    }
}
