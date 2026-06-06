package com.vendorbridge.repository;

import com.vendorbridge.entity.PurchaseOrder;
import com.vendorbridge.enums.PoStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    Optional<PurchaseOrder> findByPoNumber(String poNumber);

    boolean existsByPoNumber(String poNumber);

    List<PurchaseOrder> findByVendorId(Long vendorId);

    List<PurchaseOrder> findByStatus(PoStatus status);

    Page<PurchaseOrder> findByStatus(PoStatus status, Pageable pageable);

    /** Find PO generated from a specific approved quotation. */
    Optional<PurchaseOrder> findByQuotationId(Long quotationId);

    /** Recent POs for dashboard. */
    List<PurchaseOrder> findTop10ByOrderByCreatedAtDesc();
}
