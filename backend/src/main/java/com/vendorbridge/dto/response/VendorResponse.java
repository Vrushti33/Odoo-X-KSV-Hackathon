package com.vendorbridge.dto.response;

import com.vendorbridge.entity.Vendor;
import com.vendorbridge.enums.VendorStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class VendorResponse {
    private Long id;
    private Long userId;
    private String companyName;
    private String contactPerson;
    private String email;
    private String phone;
    private String gstNumber;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private VendorStatus status;
    private BigDecimal rating;
    private List<CategoryResponse> categories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static VendorResponse from(Vendor v) {
        return VendorResponse.builder()
                .id(v.getId())
                .userId(v.getUser() != null ? v.getUser().getId() : null)
                .companyName(v.getCompanyName())
                .contactPerson(v.getContactPerson())
                .email(v.getEmail())
                .phone(v.getPhone())
                .gstNumber(v.getGstNumber())
                .address(v.getAddress())
                .city(v.getCity())
                .state(v.getState())
                .country(v.getCountry())
                .pincode(v.getPincode())
                .status(v.getStatus())
                .rating(v.getRating())
                .categories(v.getCategories().stream()
                        .map(CategoryResponse::from)
                        .collect(Collectors.toList()))
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .build();
    }
}
