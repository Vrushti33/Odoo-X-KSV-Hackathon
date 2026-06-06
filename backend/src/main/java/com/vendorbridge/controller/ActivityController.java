package com.vendorbridge.controller;

import com.vendorbridge.enums.EntityType;
import com.vendorbridge.service.ActivityLogService;
import com.vendorbridge.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.vendorbridge.entity.User;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    // ── Activity Logs ──────────────────────────────────────────────────────

    /** GET /api/activity — paginated activity feed */
    @GetMapping("/api/activity")
    public ResponseEntity<List<Map<String, Object>>> getActivity(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(activityLogService.getAll(PageRequest.of(page, size)));
    }

    /** GET /api/activity/recent — latest 20 entries (for dashboard) */
    @GetMapping("/api/activity/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity() {
        return ResponseEntity.ok(activityLogService.getRecent());
    }

    /** GET /api/activity/{entityType}/{entityId} — entity-specific timeline */
    @GetMapping("/api/activity/{entityType}/{entityId}")
    public ResponseEntity<List<Map<String, Object>>> getEntityActivity(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        EntityType type = EntityType.valueOf(entityType.toUpperCase());
        return ResponseEntity.ok(activityLogService.getByEntity(type, entityId));
    }

    // ── Notifications ──────────────────────────────────────────────────────

    /** GET /api/notifications — all notifications for logged-in user */
    @GetMapping("/api/notifications")
    public ResponseEntity<List<Map<String, Object>>> getNotifications(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getForUser(user.getId()));
    }

    /** GET /api/notifications/unread — unread notifications */
    @GetMapping("/api/notifications/unread")
    public ResponseEntity<List<Map<String, Object>>> getUnread(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getUnreadForUser(user.getId()));
    }

    /** GET /api/notifications/count — unread badge count */
    @GetMapping("/api/notifications/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(user.getId())));
    }

    /** PATCH /api/notifications/{id}/read — mark single notification as read */
    @PatchMapping("/api/notifications/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    /** PATCH /api/notifications/read-all — mark all as read */
    @PatchMapping("/api/notifications/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.noContent().build();
    }
}
