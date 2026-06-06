package com.vendorbridge.service;

import com.vendorbridge.entity.ActivityLog;
import com.vendorbridge.entity.User;
import com.vendorbridge.enums.EntityType;
import com.vendorbridge.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    /**
     * Record an activity log entry. Call this from any service after a significant action.
     */
    @Transactional
    public void log(User user, EntityType entityType, Long entityId, String action, String description) {
        ActivityLog entry = ActivityLog.builder()
                .user(user)
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .description(description)
                .build();
        activityLogRepository.save(entry);
    }

    public List<Map<String, Object>> getAll(Pageable pageable) {
        return activityLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getByEntity(EntityType entityType, Long entityId) {
        return activityLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId)
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getRecent() {
        return activityLogRepository.findTop20ByOrderByCreatedAtDesc()
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    private Map<String, Object> toMap(ActivityLog log) {
        return Map.of(
                "id", log.getId(),
                "userId", log.getUser() != null ? log.getUser().getId() : null,
                "userName", log.getUser() != null ? log.getUser().getFirstName() + " " + log.getUser().getLastName() : "System",
                "entityType", log.getEntityType() != null ? log.getEntityType().name() : null,
                "entityId", log.getEntityId() != null ? log.getEntityId() : 0,
                "action", log.getAction(),
                "description", log.getDescription() != null ? log.getDescription() : "",
                "createdAt", log.getCreatedAt().toString()
        );
    }
}
