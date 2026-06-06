package com.vendorbridge.controller;

import com.vendorbridge.dto.request.CreateQuotationRequest;
import com.vendorbridge.dto.response.QuotationResponse;
import com.vendorbridge.service.QuotationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
@RequiredArgsConstructor
public class QuotationController {

    private final QuotationService quotationService;

    /** GET /api/quotations — list all (authenticated) */
    @GetMapping
    public ResponseEntity<List<QuotationResponse>> getAll() {
        return ResponseEntity.ok(quotationService.getAll());
    }

    /** GET /api/quotations/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<QuotationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(quotationService.getById(id));
    }

    /** GET /api/quotations/rfq/{rfqId} — all quotations for an RFQ */
    @GetMapping("/rfq/{rfqId}")
    @PreAuthorize("hasAnyRole('PROCUREMENT_OFFICER','MANAGER','ADMIN')")
    public ResponseEntity<List<QuotationResponse>> getByRfqId(@PathVariable Long rfqId) {
        return ResponseEntity.ok(quotationService.getByRfqId(rfqId));
    }

    /** GET /api/quotations/rfq/{rfqId}/compare — all quotations for an RFQ, sorted by price */
    @GetMapping("/rfq/{rfqId}/compare")
    @PreAuthorize("hasAnyRole('PROCUREMENT_OFFICER','MANAGER','ADMIN')")
    public ResponseEntity<List<QuotationResponse>> compareByRfqId(@PathVariable Long rfqId) {
        List<QuotationResponse> list = new java.util.ArrayList<>(quotationService.getByRfqId(rfqId));
        list.sort((a, b) -> {
            if (a.getGrandTotal() == null && b.getGrandTotal() == null) return 0;
            if (a.getGrandTotal() == null) return 1;
            if (b.getGrandTotal() == null) return -1;
            return a.getGrandTotal().compareTo(b.getGrandTotal());
        });
        return ResponseEntity.ok(list);
    }

    /** GET /api/quotations/vendor/{vendorId} — vendor's own quotations */
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<QuotationResponse>> getByVendorId(@PathVariable Long vendorId) {
        return ResponseEntity.ok(quotationService.getByVendorId(vendorId));
    }

    /**
     * POST /api/quotations — Vendor creates a draft quotation for an RFQ.
     * This also supports saving a draft before formal submission.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VENDOR','PROCUREMENT_OFFICER','ADMIN')")
    public ResponseEntity<QuotationResponse> create(@Valid @RequestBody CreateQuotationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quotationService.create(request));
    }

    /**
     * PUT /api/quotations/{id} — update a draft quotation (pricing/delivery/notes).
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VENDOR','PROCUREMENT_OFFICER','ADMIN')")
    public ResponseEntity<QuotationResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateQuotationRequest request) {
        return ResponseEntity.ok(quotationService.update(id, request));
    }

    /**
     * PATCH /api/quotations/{id}/submit — formally submit a DRAFT quotation.
     * Changes status from DRAFT → SUBMITTED.
     */
    @PatchMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('VENDOR','PROCUREMENT_OFFICER','ADMIN')")
    public ResponseEntity<QuotationResponse> submit(@PathVariable Long id) {
        return ResponseEntity.ok(quotationService.submit(id));
    }
}
