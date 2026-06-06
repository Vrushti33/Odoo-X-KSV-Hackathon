package com.vendorbridge.controller;

import com.vendorbridge.dto.request.ApprovalDecisionRequest;
import com.vendorbridge.dto.request.CreateApprovalRequest;
import com.vendorbridge.dto.response.ApprovalResponse;
import com.vendorbridge.entity.User;
import com.vendorbridge.service.ApprovalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN','PROCUREMENT_OFFICER')")
    public ResponseEntity<List<ApprovalResponse>> getAll() {
        return ResponseEntity.ok(approvalService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN','PROCUREMENT_OFFICER')")
    public ResponseEntity<ApprovalResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(approvalService.getById(id));
    }

    /** POST /api/approvals — Procurement officer requests manager approval */
    @PostMapping
    @PreAuthorize("hasAnyRole('PROCUREMENT_OFFICER','ADMIN')")
    public ResponseEntity<ApprovalResponse> requestApproval(
            @Valid @RequestBody CreateApprovalRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(approvalService.requestApproval(request, user));
    }

    /** PATCH /api/approvals/{id}/approve — Manager approves quotation */
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ApprovalResponse> approve(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalDecisionRequest request,
            @AuthenticationPrincipal User user) {
        if (request == null) request = new ApprovalDecisionRequest();
        return ResponseEntity.ok(approvalService.approve(id, request, user));
    }

    /** PATCH /api/approvals/{id}/reject — Manager rejects quotation */
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ApprovalResponse> reject(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalDecisionRequest request,
            @AuthenticationPrincipal User user) {
        if (request == null) request = new ApprovalDecisionRequest();
        return ResponseEntity.ok(approvalService.reject(id, request, user));
    }
}
