package com.vendorbridge.controller;

import com.vendorbridge.dto.response.ReportResponse;
import com.vendorbridge.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT_OFFICER')")
    public ResponseEntity<ReportResponse> getStats() {
        return ResponseEntity.ok(reportService.getStats());
    }
}
