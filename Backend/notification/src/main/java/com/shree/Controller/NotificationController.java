package com.shree.Controller;

import com.shree.Mapper.NotificationMapper;
import com.shree.Model.Notification;
import com.shree.Service.NotificationService;
import com.shree.Service.client.BookingFeignClient;
import com.shree.payload.dto.BookingDTO;
import com.shree.payload.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final BookingFeignClient bookingFeignClient;

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody Notification notification) throws Exception {
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationByUserId(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getAllNotificationByUserId(userId);

        List<NotificationDTO> notificationDTOS = notifications.stream()
                .map(n -> NotificationMapper.toDTO(n, safeBooking(n.getBookingId())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(notificationDTOS);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDTO> markNotificationAsRead(@PathVariable Long notificationId) throws Exception {
        Notification notification = notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok(NotificationMapper.toDTO(notification, safeBooking(notification.getBookingId())));
    }

    // A failed booking lookup must never hide a notification (or fail the whole
    // list) - the notification text is what the user needs, the booking is a bonus.
    private BookingDTO safeBooking(Long bookingId) {
        try {
            return bookingFeignClient.getBookingById(bookingId).getBody();
        } catch (Exception e) {
            return null;
        }
    }
}
