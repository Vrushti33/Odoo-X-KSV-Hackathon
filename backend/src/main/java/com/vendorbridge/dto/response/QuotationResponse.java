package com.vendorbridge.dto.response;

import com.vendorbridge.entity.Quotation;
import com.vendorbridge.entity.QuotationItem;
import com.vendorbridge.enums.QuotationStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class QuotationResponse {
    private Long id;
    private Long rfqId;
    private String rfqNumber;
    private Long vendorId;
    private String vendorName;
    private String quotationNumber;
    private BigDecimal subtotal;
    private BigDecimal taxPercentage;
    private BigDecimal taxAmount;
    private BigDecimal discountPercentage;
    private BigDecimal discountAmount;
    private BigDecimal grandTotal;
    private Integer deliveryDays;
    private String notes;
    private Integer validityDays;
    private QuotationStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;
    private List<QuotationItemResponse> items;

    @Data
    @Builder
    public static class QuotationItemResponse {
        private Long id;
        private Long rfqItemId;
        private String itemName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public static QuotationItemResponse from(QuotationItem item) {
            return QuotationItemResponse.builder()
                    .id(item.getId())
                    .rfqItemId(item.getRfqItem() != null ? item.getRfqItem().getId() : null)
                    .itemName(item.getItemName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getTotalPrice())
                    .build();
        }
    }

    public static QuotationResponse from(Quotation q) {
        return QuotationResponse.builder()
                .id(q.getId())
                .rfqId(q.getRfq().getId())
                .rfqNumber(q.getRfq().getRfqNumber())
                .vendorId(q.getVendor().getId())
                .vendorName(q.getVendor().getCompanyName())
                .quotationNumber(q.getQuotationNumber())
                .subtotal(q.getSubtotal())
                .taxPercentage(q.getTaxPercentage())
                .taxAmount(q.getTaxAmount())
                .discountPercentage(q.getDiscountPercentage())
                .discountAmount(q.getDiscountAmount())
                .grandTotal(q.getGrandTotal())
                .deliveryDays(q.getDeliveryDays())
                .notes(q.getNotes())
                .validityDays(q.getValidityDays())
                .status(q.getStatus())
                .submittedAt(q.getSubmittedAt())
                .createdAt(q.getCreatedAt())
                .items(q.getItems().stream()
                        .map(QuotationItemResponse::from)
                        .collect(Collectors.toList()))
                .build();
    }
}
