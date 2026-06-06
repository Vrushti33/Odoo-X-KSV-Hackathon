package com.vendorbridge.controller;

import com.vendorbridge.dto.request.CreateRfqRequest;
import com.vendorbridge.dto.response.RfqResponse;
import com.vendorbridge.entity.User;
import com.vendorbridge.service.RfqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rfqs")
@RequiredArgsConstructor
public class RfqController {

    private final RfqService rfqService;

    @GetMapping
    public ResponseEntity<List<RfqResponse>> getAll(@RequestParam(required = false) String status) {
        if ("PUBLISHED".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(rfqService.getPublished());
        }
        return ResponseEntity.ok(rfqService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RfqResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(rfqService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROCUREMENT_OFFICER','ADMIN')")
    public ResponseEntity<RfqResponse> create(
            @Valid @RequestBody CreateRfqRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rfqService.create(request, user));
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('PROCUREMENT_OFFICER','ADMIN')")
    public ResponseEntity<RfqResponse> publish(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rfqService.publish(id, user));
    }
}
