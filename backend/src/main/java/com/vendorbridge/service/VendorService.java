package com.vendorbridge.service;

import com.vendorbridge.dto.request.CreateVendorRequest;
import com.vendorbridge.dto.response.VendorResponse;
import com.vendorbridge.entity.Category;
import com.vendorbridge.entity.User;
import com.vendorbridge.entity.Vendor;
import com.vendorbridge.enums.VendorStatus;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.repository.CategoryRepository;
import com.vendorbridge.repository.UserRepository;
import com.vendorbridge.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<VendorResponse> getAll() {
        return vendorRepository.findAll().stream()
                .map(VendorResponse::from)
                .collect(Collectors.toList());
    }

    public Page<VendorResponse> getAllPaged(Pageable pageable) {
        return vendorRepository.findAll(pageable).map(VendorResponse::from);
    }

    public Page<VendorResponse> search(String query, Pageable pageable) {
        return vendorRepository.searchVendors(query, pageable).map(VendorResponse::from);
    }

    public List<VendorResponse> getByStatus(VendorStatus status) {
        return vendorRepository.findByStatus(status).stream()
                .map(VendorResponse::from)
                .collect(Collectors.toList());
    }

    public VendorResponse getById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
        return VendorResponse.from(vendor);
    }

    @Transactional
    public VendorResponse create(CreateVendorRequest request) {
        if (vendorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Vendor with email '" + request.getEmail() + "' already exists");
        }

        Vendor vendor = Vendor.builder()
                .companyName(request.getCompanyName())
                .contactPerson(request.getContactPerson())
                .email(request.getEmail())
                .phone(request.getPhone())
                .gstNumber(request.getGstNumber())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .pincode(request.getPincode())
                .status(VendorStatus.ACTIVE)
                .build();

        // Link to user account if provided
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
            vendor.setUser(user);
        }

        // Assign categories
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            vendor.setCategories(categories);
        }

        return VendorResponse.from(vendorRepository.save(vendor));
    }

    @Transactional
    public VendorResponse update(Long id, CreateVendorRequest request) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));

        vendor.setCompanyName(request.getCompanyName());
        vendor.setContactPerson(request.getContactPerson());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setGstNumber(request.getGstNumber());
        vendor.setAddress(request.getAddress());
        vendor.setCity(request.getCity());
        vendor.setState(request.getState());
        vendor.setCountry(request.getCountry());
        vendor.setPincode(request.getPincode());

        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            vendor.setCategories(categories);
        }

        return VendorResponse.from(vendorRepository.save(vendor));
    }

    @Transactional
    public VendorResponse changeStatus(Long id, VendorStatus status) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
        vendor.setStatus(status);
        return VendorResponse.from(vendorRepository.save(vendor));
    }

    @Transactional
    public void deactivate(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
        vendor.setStatus(VendorStatus.INACTIVE);
        vendorRepository.save(vendor);
    }

    public long countByStatus(VendorStatus status) {
        return vendorRepository.countByStatus(status);
    }
}
