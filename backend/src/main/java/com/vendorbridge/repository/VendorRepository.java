package com.vendorbridge.repository;

import com.vendorbridge.entity.Vendor;
import com.vendorbridge.enums.VendorStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Vendor> findByStatus(VendorStatus status);

    Page<Vendor> findByStatus(VendorStatus status, Pageable pageable);

    /**
     * Search vendors by company name, contact person, or email (case-insensitive).
     */
    @Query("SELECT v FROM Vendor v WHERE " +
            "LOWER(v.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.contactPerson) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Vendor> searchVendors(@Param("query") String query, Pageable pageable);

    /**
     * Count vendors by status for dashboard metrics.
     */
    long countByStatus(VendorStatus status);

    /**
     * Find vendors linked to a specific user account.
     */
    Optional<Vendor> findByUserId(Long userId);
}
