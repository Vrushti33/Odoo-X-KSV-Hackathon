package com.vendorbridge.service;

import com.vendorbridge.dto.request.CreateRfqRequest;
import com.vendorbridge.dto.response.RfqResponse;
import com.vendorbridge.entity.*;
import com.vendorbridge.enums.EntityType;
import com.vendorbridge.enums.NotificationType;
import com.vendorbridge.enums.RfqStatus;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RfqService {

    private final RfqRepository rfqRepository;
    private final CategoryRepository categoryRepository;
    private final VendorRepository vendorRepository;
    private final RfqItemRepository rfqItemRepository;
    private final RfqVendorRepository rfqVendorRepository;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    public List<RfqResponse> getAll() {
        return rfqRepository.findAll().stream()
                .map(RfqResponse::from)
                .collect(Collectors.toList());
    }

    public List<RfqResponse> getPublished() {
        return rfqRepository.findByStatus(RfqStatus.PUBLISHED).stream()
                .map(RfqResponse::from)
                .collect(Collectors.toList());
    }

    public RfqResponse getById(Long id) {
        Rfq rfq = rfqRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RFQ not found with id: " + id));
        return RfqResponse.from(rfq);
    }

    @Transactional
    public RfqResponse create(CreateRfqRequest request, User user) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        String rfqNumber = generateRfqNumber();

        Rfq rfq = Rfq.builder()
                .rfqNumber(rfqNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .budget(request.getBudget())
                .category(category)
                .createdBy(user)
                .status(RfqStatus.DRAFT)
                .build();

        rfq = rfqRepository.save(rfq);

        // Add items if any
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            List<RfqItem> items = new ArrayList<>();
            for (CreateRfqRequest.RfqItemRequest itemReq : request.getItems()) {
                items.add(RfqItem.builder()
                        .rfq(rfq)
                        .itemName(itemReq.getItemName())
                        .description(itemReq.getDescription())
                        .quantity(itemReq.getQuantity())
                        .unit(itemReq.getUnit())
                        .estimatedPrice(itemReq.getEstimatedUnitPrice())
                        .build());
            }
            rfqItemRepository.saveAll(items);
            rfq.setItems(items);
        }

        // Add vendors if any
        if (request.getVendorIds() != null && !request.getVendorIds().isEmpty()) {
            List<RfqVendor> rfqVendors = new ArrayList<>();
            List<Vendor> vendors = vendorRepository.findAllById(request.getVendorIds());
            for (Vendor v : vendors) {
                rfqVendors.add(RfqVendor.builder()
                        .rfq(rfq)
                        .vendor(v)
                        .build());
            }
            rfqVendorRepository.saveAll(rfqVendors);
            rfq.setRfqVendors(rfqVendors);
        }

        activityLogService.log(user, EntityType.RFQ, rfq.getId(), "CREATED", "Created RFQ: " + rfq.getRfqNumber());

        return RfqResponse.from(rfqRepository.save(rfq));
    }

    @Transactional
    public RfqResponse publish(Long id, User user) {
        Rfq rfq = rfqRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RFQ not found"));

        if (rfq.getStatus() != RfqStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT RFQs can be published");
        }

        rfq.setStatus(RfqStatus.PUBLISHED);
        rfq = rfqRepository.save(rfq);

        activityLogService.log(user, EntityType.RFQ, rfq.getId(), "PUBLISHED", "Published RFQ: " + rfq.getRfqNumber());

        // Notify invited vendors
        for (RfqVendor rv : rfq.getRfqVendors()) {
            if (rv.getVendor().getUser() != null) {
                notificationService.push(
                        rv.getVendor().getUser(),
                        "New RFQ Invitation",
                        "You have been invited to bid on RFQ: " + rfq.getRfqNumber() + " - " + rfq.getTitle(),
                        NotificationType.RFQ,
                        "/rfqs/" + rfq.getId()
                );
            }
        }

        return RfqResponse.from(rfq);
    }

    private String generateRfqNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = rfqRepository.count() + 1;
        return String.format("RFQ-%s-%04d", datePart, count);
    }
}
