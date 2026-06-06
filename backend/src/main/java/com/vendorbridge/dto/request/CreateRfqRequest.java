package com.vendorbridge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateRfqRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    private BigDecimal budget;
    private Long categoryId;

    /** Optional: pre-invite specific vendors */
    private List<Long> vendorIds;

    /** Optional: line items for detailed RFQ */
    private List<RfqItemRequest> items;

    @Data
    public static class RfqItemRequest {
        @NotBlank(message = "Item name is required")
        private String itemName;
        private String description;
        private Integer quantity;
        private String unit;
        private BigDecimal estimatedUnitPrice;
    }
}
