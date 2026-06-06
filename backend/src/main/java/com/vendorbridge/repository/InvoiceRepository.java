package com.vendorbridge.repository;

import com.vendorbridge.entity.Invoice;
import com.vendorbridge.enums.InvoiceStatus;
import com.vendorbridge.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    boolean existsByInvoiceNumber(String invoiceNumber);

    /** Invoice generated from a specific PO. */
    Optional<Invoice> findByPurchaseOrderId(Long purchaseOrderId);

    List<Invoice> findByVendorId(Long vendorId);

    List<Invoice> findByStatus(InvoiceStatus status);

    List<Invoice> findByPaymentStatus(PaymentStatus paymentStatus);

    Page<Invoice> findByStatus(InvoiceStatus status, Pageable pageable);

    /** Recent invoices for dashboard. */
    List<Invoice> findTop10ByOrderByCreatedAtDesc();
}
