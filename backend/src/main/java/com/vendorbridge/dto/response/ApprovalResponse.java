package com.vendorbridge.dto.response;

import com.vendorbridge.entity.Approval;
import com.vendorbridge.enums.ApprovalStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ApprovalResponse {
    private Long id;
    private Long rfqId;
    private String rfqNumber;
    private Long quotationId;
    private String quotationNumber;
    private Long vendorId;
    private String vendorName;
    private BigDecimal grandTotal;
    private Long requestedById;
    private String requestedByName;
    private Long approvedById;
    private String approvedByName;
    private ApprovalStatus status;
    private String remarks;
    private Integer stepOrder;
    private LocalDateTime requestedAt;
    private LocalDateTime resolvedAt;

    public static ApprovalResponse from(Approval a) {
        return ApprovalResponse.builder()
                .id(a.getId())
                .rfqId(a.getRfq().getId())
                .rfqNumber(a.getRfq().getRfqNumber())
                .quotationId(a.getQuotation().getId())
                .quotationNumber(a.getQuotation().getQuotationNumber())
                .vendorId(a.getQuotation().getVendor().getId())
                .vendorName(a.getQuotation().getVendor().getCompanyName())
                .grandTotal(a.getQuotation().getGrandTotal())
                .requestedById(a.getRequestedBy().getId())
                .requestedByName(a.getRequestedBy().getFirstName() + " " + a.getRequestedBy().getLastName())
                .approvedById(a.getApprovedBy() != null ? a.getApprovedBy().getId() : null)
                .approvedByName(a.getApprovedBy() != null
                        ? a.getApprovedBy().getFirstName() + " " + a.getApprovedBy().getLastName() : null)
                .status(a.getStatus())
                .remarks(a.getRemarks())
                .stepOrder(a.getStepOrder())
                .requestedAt(a.getRequestedAt())
                .resolvedAt(a.getResolvedAt())
                .build();
    }
}
