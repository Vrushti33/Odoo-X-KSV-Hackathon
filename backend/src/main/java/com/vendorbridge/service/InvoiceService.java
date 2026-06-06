package com.vendorbridge.service;

import com.vendorbridge.dto.response.InvoiceResponse;
import com.vendorbridge.entity.*;
import com.vendorbridge.enums.EntityType;
import com.vendorbridge.enums.InvoiceStatus;
import com.vendorbridge.enums.NotificationType;
import com.vendorbridge.enums.PaymentStatus;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.repository.InvoiceItemRepository;
import com.vendorbridge.repository.InvoiceRepository;
import com.vendorbridge.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceItemRepository invoiceItemRepository;
    private final PurchaseOrderRepository poRepository;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    public List<InvoiceResponse> getAll() {
        return invoiceRepository.findAll().stream()
                .map(InvoiceResponse::from)
                .collect(Collectors.toList());
    }

    public InvoiceResponse getById(Long id) {
        return invoiceRepository.findById(id)
                .map(InvoiceResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
    }

    public Invoice getEntityById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
    }

    /**
     * Auto-generate an Invoice from a PO.
     */
    @Transactional
    public InvoiceResponse generateFromPo(Long poId, User createdBy) {
        PurchaseOrder po = poRepository.findById(poId)
                .orElseThrow(() -> new ResourceNotFoundException("PO not found"));

        String invoiceNumber = generateInvoiceNumber();

        // For hackathon simplicity, we map tax amount to IGST
        BigDecimal tax = po.getTaxAmount() != null ? po.getTaxAmount() : BigDecimal.ZERO;

        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .purchaseOrder(po)
                .vendor(po.getVendor())
                .createdBy(createdBy)
                .subtotal(po.getSubtotal())
                .igst(tax)
                .cgst(BigDecimal.ZERO)
                .sgst(BigDecimal.ZERO)
                .grandTotal(po.getGrandTotal())
                .status(InvoiceStatus.PENDING_PAYMENT)
                .invoiceDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(30))
                .paymentStatus(PaymentStatus.UNPAID)
                .build();

        invoice = invoiceRepository.save(invoice);

        List<InvoiceItem> items = new ArrayList<>();
        for (PoItem pi : po.getItems()) {
            items.add(InvoiceItem.builder()
                    .invoice(invoice)
                    .itemName(pi.getItemName())
                    .quantity(pi.getQuantity())
                    .unitPrice(pi.getUnitPrice())
                    .totalPrice(pi.getTotalPrice())
                    .build());
        }
        invoiceItemRepository.saveAll(items);
        invoice.setItems(items);

        activityLogService.log(createdBy, EntityType.INVOICE, invoice.getId(), "GENERATED", "Invoice Generated: " + invoiceNumber);

        // Notify procurement officer or admin
        notificationService.push(po.getCreatedBy(), "New Invoice Submitted",
                "Vendor " + po.getVendor().getCompanyName() + " generated invoice " + invoiceNumber,
                NotificationType.INVOICE, "/invoices/" + invoice.getId());

        return InvoiceResponse.from(invoice);
    }

    private String generateInvoiceNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = invoiceRepository.count() + 1;
        return String.format("INV-%s-%04d", datePart, count);
    }
}
