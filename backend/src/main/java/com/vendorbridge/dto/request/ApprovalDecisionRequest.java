package com.vendorbridge.dto.request;

import lombok.Data;

@Data
public class ApprovalDecisionRequest {
    /** Optional remarks / reason for decision */
    private String remarks;
}
