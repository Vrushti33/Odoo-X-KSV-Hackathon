package com.vendorbridge.dto.response;

import com.vendorbridge.entity.PoItem;
import com.vendorbridge.entity.PurchaseOrder;
import com.vendorbridge.enums.PoStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class PoResponse {
    private Long id;
    private String poNumber;
    private Long rfqId;
    private String rfqNumber;
    private Long vendorId;
    private String vendorName;
    private Long createdById;
    private String createdByName;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal grandTotal;
    private PoStatus status;
    private LocalDate poDate;
    private LocalDate deliveryDate;
    private LocalDateTime createdAt;
    private List<PoItemResponse> items;

    @Data
    @Builder
    public static class PoItemResponse {
        private Long id;
        private String itemName;
        private Integer quantity;
        private String unit;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;

        public static PoItemResponse from(PoItem item) {
            return PoItemResponse.builder()
                    .id(item.getId())
                    .itemName(item.getItemName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .lineTotal(item.getTotalPrice())
                    .build();
        }
    }

    public static PoResponse from(PurchaseOrder po) {
        return PoResponse.builder()
                .id(po.getId())
                .poNumber(po.getPoNumber())
                .rfqId(po.getRfq() != null ? po.getRfq().getId() : null)
                .rfqNumber(po.getRfq() != null ? po.getRfq().getRfqNumber() : null)
                .vendorId(po.getVendor().getId())
                .vendorName(po.getVendor().getCompanyName())
                .createdById(po.getCreatedBy().getId())
                .createdByName(po.getCreatedBy().getFirstName() + " " + po.getCreatedBy().getLastName())
                .subtotal(po.getSubtotal())
                .taxAmount(po.getTaxAmount())
                .grandTotal(po.getGrandTotal())
                .status(po.getStatus())
                .poDate(po.getPoDate())
                .deliveryDate(po.getDeliveryDate())
                .createdAt(po.getCreatedAt())
                .items(po.getItems().stream().map(PoItemResponse::from).collect(Collectors.toList()))
                .build();
    }
}
