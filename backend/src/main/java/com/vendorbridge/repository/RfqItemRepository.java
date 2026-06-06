package com.vendorbridge.repository;

import com.vendorbridge.entity.RfqItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RfqItemRepository extends JpaRepository<RfqItem, Long> {

    List<RfqItem> findByRfqId(Long rfqId);
}
