package com.vendorbridge.service;

import com.vendorbridge.dto.request.CreateQuotationRequest;
import com.vendorbridge.dto.response.QuotationResponse;
import com.vendorbridge.entity.*;
import com.vendorbridge.enums.QuotationStatus;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final QuotationItemRepository quotationItemRepository;
    private final RfqRepository rfqRepository;
    private final VendorRepository vendorRepository;
    private final RfqItemRepository rfqItemRepository;

    public List<QuotationResponse> getAll() {
        return quotationRepository.findAll().stream()
                .map(QuotationResponse::from)
                .collect(Collectors.toList());
    }

    public QuotationResponse getById(Long id) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found with id: " + id));
        return QuotationResponse.from(quotation);
    }

    public List<QuotationResponse> getByRfqId(Long rfqId) {
        return quotationRepository.findByRfqId(rfqId).stream()
                .map(QuotationResponse::from)
                .collect(Collectors.toList());
    }

    public List<QuotationResponse> getByVendorId(Long vendorId) {
        return quotationRepository.findByVendorId(vendorId).stream()
                .map(QuotationResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Create a new DRAFT quotation. The vendor can save a draft before formally submitting.
     */
    @Transactional
    public QuotationResponse create(CreateQuotationRequest request) {
        Rfq rfq = rfqRepository.findById(request.getRfqId())
                .orElseThrow(() -> new ResourceNotFoundException("RFQ not found with id: " + request.getRfqId()));

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + request.getVendorId()));

        String quotationNumber = generateQuotationNumber();

        // Build item list and compute subtotal
        List<QuotationItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        Quotation quotation = Quotation.builder()
                .rfq(rfq)
                .vendor(vendor)
                .quotationNumber(quotationNumber)
                .taxPercentage(request.getTaxPercentage() != null ? request.getTaxPercentage() : BigDecimal.ZERO)
                .discountPercentage(request.getDiscountPercentage() != null ? request.getDiscountPercentage() : BigDecimal.ZERO)
                .deliveryDays(request.getDeliveryDays())
                .notes(request.getNotes())
                .validityDays(request.getValidityDays() != null ? request.getValidityDays() : 30)
                .status(QuotationStatus.DRAFT)
                .build();

        quotation = quotationRepository.save(quotation);

        for (CreateQuotationRequest.QuotationItemRequest itemReq : request.getItems()) {
            BigDecimal lineTotal = itemReq.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);
            subtotal = subtotal.add(lineTotal);

            QuotationItem item = QuotationItem.builder()
                    .quotation(quotation)
                    .itemName(itemReq.getItemName())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .totalPrice(lineTotal)
                    .build();

            if (itemReq.getRfqItemId() != null) {
                RfqItem rfqItem = rfqItemRepository.findById(itemReq.getRfqItemId()).orElse(null);
                item.setRfqItem(rfqItem);
            }

            items.add(item);
        }

        quotationItemRepository.saveAll(items);
        quotation.getItems().addAll(items);

        // Calculate tax, discount, grand total
        BigDecimal taxAmt = subtotal.multiply(quotation.getTaxPercentage())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal discountAmt = subtotal.multiply(quotation.getDiscountPercentage())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal grandTotal = subtotal.add(taxAmt).subtract(discountAmt);

        quotation.setSubtotal(subtotal);
        quotation.setTaxAmount(taxAmt);
        quotation.setDiscountAmount(discountAmt);
        quotation.setGrandTotal(grandTotal);

        return QuotationResponse.from(quotationRepository.save(quotation));
    }

    /**
     * Formally submit a draft quotation (status: DRAFT → SUBMITTED).
     */
    @Transactional
    public QuotationResponse submit(Long id) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found with id: " + id));

        if (quotation.getStatus() != QuotationStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT quotations can be submitted");
        }

        quotation.setStatus(QuotationStatus.SUBMITTED);
        quotation.setSubmittedAt(LocalDateTime.now());
        return QuotationResponse.from(quotationRepository.save(quotation));
    }

    /**
     * Update a draft quotation before submission.
     */
    @Transactional
    public QuotationResponse update(Long id, CreateQuotationRequest request) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found with id: " + id));

        if (quotation.getStatus() != QuotationStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT quotations can be updated");
        }

        quotation.setDeliveryDays(request.getDeliveryDays());
        quotation.setNotes(request.getNotes());
        quotation.setTaxPercentage(request.getTaxPercentage() != null ? request.getTaxPercentage() : BigDecimal.ZERO);
        quotation.setDiscountPercentage(request.getDiscountPercentage() != null ? request.getDiscountPercentage() : BigDecimal.ZERO);
        if (request.getValidityDays() != null) quotation.setValidityDays(request.getValidityDays());

        // Recalculate totals
        BigDecimal subtotal = quotation.getItems().stream()
                .map(QuotationItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal taxAmt = subtotal.multiply(quotation.getTaxPercentage())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal discountAmt = subtotal.multiply(quotation.getDiscountPercentage())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        quotation.setSubtotal(subtotal);
        quotation.setTaxAmount(taxAmt);
        quotation.setDiscountAmount(discountAmt);
        quotation.setGrandTotal(subtotal.add(taxAmt).subtract(discountAmt));

        return QuotationResponse.from(quotationRepository.save(quotation));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private String generateQuotationNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = quotationRepository.count() + 1;
        return String.format("QUO-%s-%04d", datePart, count);
    }
}
