package com.vendorbridge.controller;

import com.vendorbridge.dto.request.CreateVendorRequest;
import com.vendorbridge.dto.response.MessageResponse;
import com.vendorbridge.dto.response.VendorResponse;
import com.vendorbridge.enums.VendorStatus;
import com.vendorbridge.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    /**
     * GET /api/vendors
     * Supports optional ?status= filter and ?search= query.
     * Returns paginated results or all if no pagination params provided.
     */
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 50) Pageable pageable) {

        if (search != null && !search.isBlank()) {
            Page<VendorResponse> page = vendorService.search(search, pageable);
            return ResponseEntity.ok(page);
        }
        if (status != null && !status.isBlank()) {
            VendorStatus vendorStatus = VendorStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(vendorService.getByStatus(vendorStatus));
        }
        // Return full list for small datasets (frontend handles pagination)
        List<VendorResponse> all = vendorService.getAll();
        return ResponseEntity.ok(all);
    }

    /** GET /api/vendors/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<VendorResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getById(id));
    }

    /** POST /api/vendors — ADMIN or PROCUREMENT_OFFICER */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROCUREMENT_OFFICER')")
    public ResponseEntity<VendorResponse> create(@Valid @RequestBody CreateVendorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vendorService.create(request));
    }

    /** PUT /api/vendors/{id} — ADMIN or PROCUREMENT_OFFICER */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROCUREMENT_OFFICER')")
    public ResponseEntity<VendorResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateVendorRequest request) {
        return ResponseEntity.ok(vendorService.update(id, request));
    }

    /** DELETE /api/vendors/{id} — deactivates (soft delete), ADMIN only */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deactivate(@PathVariable Long id) {
        vendorService.deactivate(id);
        return ResponseEntity.ok(MessageResponse.of("Vendor deactivated successfully"));
    }

    /** PATCH /api/vendors/{id}/status — change vendor status, ADMIN only */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VendorResponse> changeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        VendorStatus status = VendorStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(vendorService.changeStatus(id, status));
    }
}
