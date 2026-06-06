package com.vendorbridge.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateQuotationRequest {

    @NotNull(message = "RFQ ID is required")
    private Long rfqId;

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    private BigDecimal taxPercentage;
    private BigDecimal discountPercentage;
    private Integer deliveryDays;
    private String notes;
    private Integer validityDays;

    @NotNull(message = "Line items are required")
    private List<QuotationItemRequest> items;

    @Data
    public static class QuotationItemRequest {
        private Long rfqItemId;       // optional link back to original RFQ item
        private String itemName;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}
