package com.vendorbridge.repository;

import com.vendorbridge.entity.Approval;
import com.vendorbridge.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {

    /** All approval records for a given RFQ. */
    List<Approval> findByRfqId(Long rfqId);

    /** Approval records for a specific quotation. */
    List<Approval> findByQuotationId(Long quotationId);

    /** Pending approvals (for manager dashboard). */
    List<Approval> findByStatus(ApprovalStatus status);

    /** Count pending approvals (for dashboard stats). */
    long countByStatus(ApprovalStatus status);

    /** The current active approval step for a quotation. */
    Optional<Approval> findByQuotationIdAndStepOrder(Long quotationId, Integer stepOrder);
}
