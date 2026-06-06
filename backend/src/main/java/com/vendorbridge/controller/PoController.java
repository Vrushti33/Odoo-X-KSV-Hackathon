package com.vendorbridge.controller;

import com.vendorbridge.dto.response.PoResponse;
import com.vendorbridge.entity.PurchaseOrder;
import com.vendorbridge.entity.User;
import com.vendorbridge.service.PdfService;
import com.vendorbridge.service.PoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
public class PoController {

    private final PoService poService;
    private final PdfService pdfService;

    @GetMapping
    public ResponseEntity<List<PoResponse>> getAll() {
        return ResponseEntity.ok(poService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(poService.getById(id));
    }

    @PostMapping("/generate/{quotationId}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN','PROCUREMENT_OFFICER')")
    public ResponseEntity<PoResponse> generate(
            @PathVariable Long quotationId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(poService.generateFromQuotation(quotationId, user));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        try {
            PurchaseOrder po = poService.getEntityById(id);
            byte[] pdfBytes = pdfService.generatePoPdf(po);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=PO-" + po.getPoNumber() + ".pdf")
                    .header("Content-Type", "application/pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
