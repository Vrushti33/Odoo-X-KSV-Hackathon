package com.vendorbridge.service;

import com.vendorbridge.dto.response.PoResponse;
import com.vendorbridge.entity.*;
import com.vendorbridge.enums.EntityType;
import com.vendorbridge.enums.NotificationType;
import com.vendorbridge.enums.PoStatus;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.repository.PoItemRepository;
import com.vendorbridge.repository.PurchaseOrderRepository;
import com.vendorbridge.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PoService {

    private final PurchaseOrderRepository poRepository;
    private final PoItemRepository poItemRepository;
    private final QuotationRepository quotationRepository;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    public List<PoResponse> getAll() {
        return poRepository.findAll().stream()
                .map(PoResponse::from)
                .collect(Collectors.toList());
    }

    public PoResponse getById(Long id) {
        return poRepository.findById(id)
                .map(PoResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("PO not found"));
    }

    public PurchaseOrder getEntityById(Long id) {
        return poRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PO not found"));
    }

    /**
     * Auto-generate a Purchase Order from an approved Quotation.
     */
    @Transactional
    public PoResponse generateFromQuotation(Long quotationId, User createdBy) {
        Quotation quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found"));

        String poNumber = generatePoNumber();

        PurchaseOrder po = PurchaseOrder.builder()
                .poNumber(poNumber)
                .rfq(quotation.getRfq())
                .quotation(quotation)
                .vendor(quotation.getVendor())
                .createdBy(createdBy)
                .subtotal(quotation.getSubtotal())
                .taxAmount(quotation.getTaxAmount())
                .grandTotal(quotation.getGrandTotal())
                .status(PoStatus.ISSUED) // Automatically issued for hackathon simplicity
                .poDate(LocalDate.now())
                .deliveryDate(LocalDate.now().plusDays(quotation.getDeliveryDays() != null ? quotation.getDeliveryDays() : 14))
                .build();

        po = poRepository.save(po);

        List<PoItem> items = new ArrayList<>();
        for (QuotationItem qi : quotation.getItems()) {
            items.add(PoItem.builder()
                    .purchaseOrder(po)
                    .itemName(qi.getItemName())
                    .quantity(qi.getQuantity())
                    .unitPrice(qi.getUnitPrice())
                    .totalPrice(qi.getTotalPrice())
                    .build());
        }
        poItemRepository.saveAll(items);
        po.setItems(items);

        activityLogService.log(createdBy, EntityType.PO, po.getId(), "GENERATED", "PO Generated: " + poNumber);

        if (po.getVendor().getUser() != null) {
            notificationService.push(po.getVendor().getUser(), "New Purchase Order",
                    "A new Purchase Order " + poNumber + " has been issued to your company.",
                    NotificationType.GENERAL, "/purchase-orders/" + po.getId());
        }

        return PoResponse.from(po);
    }

    private String generatePoNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = poRepository.count() + 1;
        return String.format("PO-%s-%04d", datePart, count);
    }
}
