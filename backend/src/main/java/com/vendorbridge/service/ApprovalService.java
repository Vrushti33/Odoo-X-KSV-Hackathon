package com.vendorbridge.service;

import com.vendorbridge.dto.request.ApprovalDecisionRequest;
import com.vendorbridge.dto.request.CreateApprovalRequest;
import com.vendorbridge.dto.response.ApprovalResponse;
import com.vendorbridge.entity.*;
import com.vendorbridge.enums.ApprovalStatus;
import com.vendorbridge.enums.EntityType;
import com.vendorbridge.enums.NotificationType;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.repository.ApprovalRepository;
import com.vendorbridge.repository.QuotationRepository;
import com.vendorbridge.repository.RfqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final ApprovalRepository approvalRepository;
    private final RfqRepository rfqRepository;
    private final QuotationRepository quotationRepository;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    public List<ApprovalResponse> getAll() {
        return approvalRepository.findAll().stream()
                .map(ApprovalResponse::from)
                .collect(Collectors.toList());
    }

    public ApprovalResponse getById(Long id) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Approval not found with id: " + id));
        return ApprovalResponse.from(approval);
    }

    @Transactional
    public ApprovalResponse requestApproval(CreateApprovalRequest request, User requestedBy) {
        Rfq rfq = rfqRepository.findById(request.getRfqId())
                .orElseThrow(() -> new ResourceNotFoundException("RFQ not found"));

        Quotation quotation = quotationRepository.findById(request.getQuotationId())
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found"));

        Approval approval = Approval.builder()
                .rfq(rfq)
                .quotation(quotation)
                .requestedBy(requestedBy)
                .stepOrder(request.getStepOrder() != null ? request.getStepOrder() : 1)
                .remarks(request.getRemarks())
                .status(ApprovalStatus.PENDING)
                .build();

        approval = approvalRepository.save(approval);

        activityLogService.log(requestedBy, EntityType.APPROVAL, approval.getId(), "REQUESTED",
                "Approval requested for Quotation: " + quotation.getQuotationNumber());

        return ApprovalResponse.from(approval);
    }

    @Transactional
    public ApprovalResponse approve(Long id, ApprovalDecisionRequest request, User approvedBy) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Approval not found"));

        if (approval.getStatus() != ApprovalStatus.PENDING) {
            throw new IllegalStateException("Only PENDING approvals can be approved");
        }

        approval.setStatus(ApprovalStatus.APPROVED);
        approval.setApprovedBy(approvedBy);
        approval.setRemarks(request.getRemarks() != null ? request.getRemarks() : approval.getRemarks());
        approval.setResolvedAt(LocalDateTime.now());

        approval = approvalRepository.save(approval);

        activityLogService.log(approvedBy, EntityType.APPROVAL, approval.getId(), "APPROVED",
                "Quotation " + approval.getQuotation().getQuotationNumber() + " approved.");

        notificationService.push(approval.getRequestedBy(), "Quotation Approved",
                "Your approval request for quotation " + approval.getQuotation().getQuotationNumber() + " was approved.",
                NotificationType.APPROVAL, "/approvals");

        return ApprovalResponse.from(approval);
    }

    @Transactional
    public ApprovalResponse reject(Long id, ApprovalDecisionRequest request, User rejectedBy) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Approval not found"));

        if (approval.getStatus() != ApprovalStatus.PENDING) {
            throw new IllegalStateException("Only PENDING approvals can be rejected");
        }

        approval.setStatus(ApprovalStatus.REJECTED);
        approval.setApprovedBy(rejectedBy);
        approval.setRemarks(request.getRemarks() != null ? request.getRemarks() : approval.getRemarks());
        approval.setResolvedAt(LocalDateTime.now());

        approval = approvalRepository.save(approval);

        activityLogService.log(rejectedBy, EntityType.APPROVAL, approval.getId(), "REJECTED",
                "Quotation " + approval.getQuotation().getQuotationNumber() + " rejected.");

        notificationService.push(approval.getRequestedBy(), "Quotation Rejected",
                "Your approval request for quotation " + approval.getQuotation().getQuotationNumber() + " was rejected.",
                NotificationType.APPROVAL, "/approvals");

        return ApprovalResponse.from(approval);
    }
}
