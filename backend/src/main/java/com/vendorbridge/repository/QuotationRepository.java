package com.vendorbridge.repository;

import com.vendorbridge.entity.Quotation;
import com.vendorbridge.enums.QuotationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    /** All quotations submitted for a given RFQ. */
    List<Quotation> findByRfqId(Long rfqId);

    /** All quotations submitted by a vendor. */
    List<Quotation> findByVendorId(Long vendorId);

    /** A specific vendor's quotation for a specific RFQ. */
    Optional<Quotation> findByRfqIdAndVendorId(Long rfqId, Long vendorId);

    /** All quotations for an RFQ filtered by status (e.g., SUBMITTED). */
    List<Quotation> findByRfqIdAndStatus(Long rfqId, QuotationStatus status);

    boolean existsByQuotationNumber(String quotationNumber);
}
