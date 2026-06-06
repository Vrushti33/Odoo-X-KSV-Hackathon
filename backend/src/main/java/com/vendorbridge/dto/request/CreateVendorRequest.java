package com.vendorbridge.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreateVendorRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String email;

    private String phone;
    private String gstNumber;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;

    /** Optional: IDs of categories to associate */
    private List<Long> categoryIds;

    /** Optional: link to an existing user account */
    private Long userId;
}
