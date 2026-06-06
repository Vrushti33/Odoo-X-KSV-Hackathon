package com.vendorbridge.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateApprovalRequest {

    @NotNull(message = "RFQ ID is required")
    private Long rfqId;

    @NotNull(message = "Quotation ID is required")
    private Long quotationId;

    private String remarks;

    private Integer stepOrder;
}
