package com.vendorbridge.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private long totalRFQs;
    private long activeRFQs;
    private long pendingApprovals;
    private long totalPOs;
}
