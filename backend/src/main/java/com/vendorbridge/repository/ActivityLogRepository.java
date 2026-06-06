package com.vendorbridge.repository;

import com.vendorbridge.entity.ActivityLog;
import com.vendorbridge.enums.EntityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(EntityType entityType, Long entityId);

    Page<ActivityLog> findByEntityTypeOrderByCreatedAtDesc(EntityType entityType, Pageable pageable);

    Page<ActivityLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<ActivityLog> findTop20ByOrderByCreatedAtDesc();
}
