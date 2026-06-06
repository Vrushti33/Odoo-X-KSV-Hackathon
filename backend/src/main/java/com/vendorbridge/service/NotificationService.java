package com.vendorbridge.service;

import com.vendorbridge.entity.Notification;
import com.vendorbridge.entity.User;
import com.vendorbridge.enums.NotificationType;
import com.vendorbridge.repository.NotificationRepository;
import com.vendorbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Push a notification to a specific user. Call from service layer after events.
     */
    @Transactional
    public void push(User user, String title, String message, NotificationType type, String link) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .link(link)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    /** All notifications for a user (newest first). */
    public List<Map<String, Object>> getForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    /** Unread notifications only. */
    public List<Map<String, Object>> getUnreadForUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    /** Count of unread notifications for the top-bar badge. */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }

    private Map<String, Object> toMap(Notification n) {
        return Map.of(
                "id", n.getId(),
                "title", n.getTitle() != null ? n.getTitle() : "",
                "message", n.getMessage() != null ? n.getMessage() : "",
                "type", n.getType() != null ? n.getType().name() : "GENERAL",
                "isRead", n.getIsRead(),
                "link", n.getLink() != null ? n.getLink() : "",
                "createdAt", n.getCreatedAt().toString()
        );
    }
}
