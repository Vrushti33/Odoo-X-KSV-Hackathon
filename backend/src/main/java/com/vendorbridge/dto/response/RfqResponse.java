package com.vendorbridge.dto.response;

import com.vendorbridge.entity.Rfq;
import com.vendorbridge.entity.RfqItem;
import com.vendorbridge.enums.RfqStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class RfqResponse {
    private Long id;
    private String rfqNumber;
    private String title;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Long createdById;
    private String createdByName;
    private RfqStatus status;
    private LocalDate deadline;
    private BigDecimal budget;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<RfqItemResponse> items;
    private int vendorCount;

    @Data
    @Builder
    public static class RfqItemResponse {
        private Long id;
        private String itemName;
        private String description;
        private Integer quantity;
        private String unit;
        private BigDecimal estimatedUnitPrice;

        public static RfqItemResponse from(RfqItem item) {
            return RfqItemResponse.builder()
                    .id(item.getId())
                    .itemName(item.getItemName())
                    .description(item.getDescription())
                    .quantity(item.getQuantity())
                    .unit(item.getUnit())
                    .estimatedUnitPrice(item.getEstimatedPrice())
                    .build();
        }
    }

    public static RfqResponse from(Rfq r) {
        return RfqResponse.builder()
                .id(r.getId())
                .rfqNumber(r.getRfqNumber())
                .title(r.getTitle())
                .description(r.getDescription())
                .categoryId(r.getCategory() != null ? r.getCategory().getId() : null)
                .categoryName(r.getCategory() != null ? r.getCategory().getName() : null)
                .createdById(r.getCreatedBy().getId())
                .createdByName(r.getCreatedBy().getFirstName() + " " + r.getCreatedBy().getLastName())
                .status(r.getStatus())
                .deadline(r.getDeadline())
                .budget(r.getBudget())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .items(r.getItems().stream()
                        .map(RfqItemResponse::from)
                        .collect(Collectors.toList()))
                .vendorCount(r.getRfqVendors().size())
                .build();
    }
}
