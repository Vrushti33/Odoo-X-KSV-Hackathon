package com.vendorbridge.repository;

import com.vendorbridge.entity.Rfq;
import com.vendorbridge.enums.RfqStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RfqRepository extends JpaRepository<Rfq, Long> {

    Optional<Rfq> findByRfqNumber(String rfqNumber);

    boolean existsByRfqNumber(String rfqNumber);

    List<Rfq> findByStatus(RfqStatus status);

    Page<Rfq> findByStatus(RfqStatus status, Pageable pageable);

    List<Rfq> findByCreatedById(Long userId);

    /** Count active (PUBLISHED) RFQs for dashboard stats. */
    long countByStatus(RfqStatus status);

    /** Search RFQs by title or RFQ number. */
    @Query("SELECT r FROM Rfq r WHERE " +
            "LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(r.rfqNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Rfq> searchRfqs(@Param("query") String query, Pageable pageable);

    /** RFQs a specific vendor has been invited to. */
    @Query("SELECT r FROM Rfq r JOIN r.rfqVendors rv WHERE rv.vendor.id = :vendorId")
    List<Rfq> findRfqsByVendorId(@Param("vendorId") Long vendorId);
}
