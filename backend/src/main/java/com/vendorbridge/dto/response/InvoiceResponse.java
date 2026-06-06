package com.vendorbridge.dto.response;

import com.vendorbridge.entity.Invoice;
import com.vendorbridge.entity.InvoiceItem;
import com.vendorbridge.enums.InvoiceStatus;
import com.vendorbridge.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private Long poId;
    private String poNumber;
    private Long vendorId;
    private String vendorName;
    private BigDecimal subtotal;
    private BigDecimal sgst;
    private BigDecimal cgst;
    private BigDecimal igst;
    private BigDecimal grandTotal;
    private InvoiceStatus status;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private List<InvoiceItemResponse> items;

    @Data
    @Builder
    public static class InvoiceItemResponse {
        private Long id;
        private String itemName;
        private Integer quantity;
        private String unit;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;

        public static InvoiceItemResponse from(InvoiceItem item) {
            return InvoiceItemResponse.builder()
                    .id(item.getId())
                    .itemName(item.getItemName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .lineTotal(item.getTotalPrice())
                    .build();
        }
    }

    public static InvoiceResponse from(Invoice inv) {
        return InvoiceResponse.builder()
                .id(inv.getId())
                .invoiceNumber(inv.getInvoiceNumber())
                .poId(inv.getPurchaseOrder().getId())
                .poNumber(inv.getPurchaseOrder().getPoNumber())
                .vendorId(inv.getVendor().getId())
                .vendorName(inv.getVendor().getCompanyName())
                .subtotal(inv.getSubtotal())
                .sgst(inv.getSgst())
                .cgst(inv.getCgst())
                .igst(inv.getIgst())
                .grandTotal(inv.getGrandTotal())
                .status(inv.getStatus())
                .invoiceDate(inv.getInvoiceDate())
                .dueDate(inv.getDueDate())
                .paymentStatus(inv.getPaymentStatus())
                .createdAt(inv.getCreatedAt())
                .items(inv.getItems().stream().map(InvoiceItemResponse::from).collect(Collectors.toList()))
                .build();
    }
}
