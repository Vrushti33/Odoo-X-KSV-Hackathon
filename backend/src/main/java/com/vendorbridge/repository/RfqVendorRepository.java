package com.vendorbridge.repository;

import com.vendorbridge.entity.RfqVendor;
import com.vendorbridge.enums.RfqVendorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RfqVendorRepository extends JpaRepository<RfqVendor, Long> {

    List<RfqVendor> findByRfqId(Long rfqId);

    List<RfqVendor> findByVendorId(Long vendorId);

    Optional<RfqVendor> findByRfqIdAndVendorId(Long rfqId, Long vendorId);

    List<RfqVendor> findByRfqIdAndStatus(Long rfqId, RfqVendorStatus status);
}
