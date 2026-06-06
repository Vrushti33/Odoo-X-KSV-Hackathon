package com.vendorbridge.service;

import com.vendorbridge.dto.response.ReportResponse;
import com.vendorbridge.entity.Approval;
import com.vendorbridge.entity.PurchaseOrder;
import com.vendorbridge.entity.Quotation;
import com.vendorbridge.entity.Rfq;
import com.vendorbridge.enums.ApprovalStatus;
import com.vendorbridge.enums.RfqStatus;
import com.vendorbridge.repository.ApprovalRepository;
import com.vendorbridge.repository.PurchaseOrderRepository;
import com.vendorbridge.repository.QuotationRepository;
import com.vendorbridge.repository.RfqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final RfqRepository rfqRepository;
    private final QuotationRepository quotationRepository;
    private final ApprovalRepository approvalRepository;
    private final PurchaseOrderRepository poRepository;

    public ReportResponse getStats() {
        List<Rfq> rfqs = rfqRepository.findAll();
        List<Quotation> quotations = quotationRepository.findAll();
        List<Approval> approvals = approvalRepository.findAll();
        List<PurchaseOrder> pos = poRepository.findAll();

        // 1. Calculate values
        BigDecimal totalRFQValue = rfqs.stream()
                .map(r -> r.getBudget() != null ? r.getBudget() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalQuotationValue = quotations.stream()
                .map(q -> q.getGrandTotal() != null ? q.getGrandTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal approvedValue = approvals.stream()
                .filter(a -> a.getStatus() == ApprovalStatus.APPROVED)
                .map(a -> a.getQuotation() != null && a.getQuotation().getGrandTotal() != null 
                        ? a.getQuotation().getGrandTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal poValue = pos.stream()
                .map(p -> p.getGrandTotal() != null ? p.getGrandTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. RFQ Status Data
        long openRfqs = rfqs.stream()
                .filter(r -> r.getStatus() == RfqStatus.PUBLISHED || r.getStatus() == RfqStatus.DRAFT)
                .count();
        long closedRfqs = rfqs.stream()
                .filter(r -> r.getStatus() == RfqStatus.CLOSED || r.getStatus() == RfqStatus.CANCELLED)
                .count();

        List<ReportResponse.StatusCount> rfqStatusData = Arrays.asList(
                ReportResponse.StatusCount.builder().name("Open").value(openRfqs).build(),
                ReportResponse.StatusCount.builder().name("Closed").value(closedRfqs).build()
        );

        // 3. Approval Status Data
        long pendingApprovals = approvals.stream().filter(a -> a.getStatus() == ApprovalStatus.PENDING).count();
        long approvedApprovals = approvals.stream().filter(a -> a.getStatus() == ApprovalStatus.APPROVED).count();
        long rejectedApprovals = approvals.stream().filter(a -> a.getStatus() == ApprovalStatus.REJECTED).count();

        List<ReportResponse.StatusCount> approvalStatusData = Arrays.asList(
                ReportResponse.StatusCount.builder().name("Pending").value(pendingApprovals).build(),
                ReportResponse.StatusCount.builder().name("Approved").value(approvedApprovals).build(),
                ReportResponse.StatusCount.builder().name("Rejected").value(rejectedApprovals).build()
        );

        // 4. Trend Data for the last 3 months
        List<ReportResponse.TrendData> trendData = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 2; i >= 0; i--) {
            LocalDateTime targetMonth = now.minusMonths(i);
            String monthName = targetMonth.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            int year = targetMonth.getYear();
            int monthValue = targetMonth.getMonthValue();

            long rfqCount = rfqs.stream()
                    .filter(r -> r.getCreatedAt() != null && r.getCreatedAt().getYear() == year && r.getCreatedAt().getMonthValue() == monthValue)
                    .count();

            long quotationCount = quotations.stream()
                    .filter(q -> q.getCreatedAt() != null && q.getCreatedAt().getYear() == year && q.getCreatedAt().getMonthValue() == monthValue)
                    .count();

            trendData.add(ReportResponse.TrendData.builder()
                    .month(monthName)
                    .rfqs(rfqCount)
                    .quotations(quotationCount)
                    .build());
        }

        return ReportResponse.builder()
                .totalRFQValue(totalRFQValue)
                .totalQuotationValue(totalQuotationValue)
                .approvedValue(approvedValue)
                .poValue(poValue)
                .rfqStatusData(rfqStatusData)
                .approvalStatusData(approvalStatusData)
                .trendData(trendData)
                .totalRFQs(rfqs.size())
                .totalQuotations(quotations.size())
                .totalApprovals(approvals.size())
                .totalPOs(pos.size())
                .build();
    }
}
