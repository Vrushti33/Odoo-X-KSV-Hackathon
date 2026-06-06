package com.vendorbridge.service;

import com.vendorbridge.dto.response.DashboardResponse;
import com.vendorbridge.enums.ApprovalStatus;
import com.vendorbridge.enums.RfqStatus;
import com.vendorbridge.repository.ApprovalRepository;
import com.vendorbridge.repository.PurchaseOrderRepository;
import com.vendorbridge.repository.RfqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RfqRepository rfqRepository;
    private final ApprovalRepository approvalRepository;
    private final PurchaseOrderRepository poRepository;

    public DashboardResponse getStats() {
        return DashboardResponse.builder()
                .totalRFQs(rfqRepository.count())
                .activeRFQs(rfqRepository.countByStatus(RfqStatus.PUBLISHED))
                .pendingApprovals(approvalRepository.countByStatus(ApprovalStatus.PENDING))
                .totalPOs(poRepository.count())
                .build();
    }
}
