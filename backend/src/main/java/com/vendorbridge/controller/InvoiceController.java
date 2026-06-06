package com.vendorbridge.controller;

import com.vendorbridge.dto.response.InvoiceResponse;
import com.vendorbridge.entity.Invoice;
import com.vendorbridge.entity.User;
import com.vendorbridge.service.EmailService;
import com.vendorbridge.service.InvoiceService;
import com.vendorbridge.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PdfService pdfService;
    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> getAll() {
        return ResponseEntity.ok(invoiceService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }

    @PostMapping("/generate/{poId}")
    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    public ResponseEntity<InvoiceResponse> generate(
            @PathVariable Long poId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.generateFromPo(poId, user));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        try {
            Invoice invoice = invoiceService.getEntityById(id);
            byte[] pdfBytes = pdfService.generateInvoicePdf(invoice);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=INV-" + invoice.getInvoiceNumber() + ".pdf")
                    .header("Content-Type", "application/pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{id}/send-email")
    public ResponseEntity<Void> sendEmail(@PathVariable Long id) {
        try {
            Invoice invoice = invoiceService.getEntityById(id);
            byte[] pdfBytes = pdfService.generateInvoicePdf(invoice);
            
            // In a real app, we would get the procurement officer's email or vendor's email
            // For hackathon, we can send to a dummy or the creator's email if valid
            String targetEmail = invoice.getPurchaseOrder().getCreatedBy().getEmail();
            
            emailService.sendEmailWithAttachment(
                    targetEmail,
                    "Invoice " + invoice.getInvoiceNumber() + " from " + invoice.getVendor().getCompanyName(),
                    "Please find attached the invoice generated for PO " + invoice.getPurchaseOrder().getPoNumber() + ".",
                    pdfBytes,
                    "Invoice-" + invoice.getInvoiceNumber() + ".pdf"
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
