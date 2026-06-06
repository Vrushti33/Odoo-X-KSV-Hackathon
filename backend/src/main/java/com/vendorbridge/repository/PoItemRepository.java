package com.vendorbridge.repository;

import com.vendorbridge.entity.PoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PoItemRepository extends JpaRepository<PoItem, Long> {

    List<PoItem> findByPurchaseOrderId(Long purchaseOrderId);
}
