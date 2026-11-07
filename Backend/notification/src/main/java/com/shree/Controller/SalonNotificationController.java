package com.shree.Controller;

import com.shree.Mapper.NotificationMapper;
import com.shree.Model.Notification;
import com.shree.Service.NotificationService;
import com.shree.Service.client.BookingFeignClient;
import com.shree.payload.dto.BookingDTO;
import com.shree.payload.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications/salon-owner")
public class SalonNotificationController {

    private final NotificationService notificationService;
    private final BookingFeignClient bookingFeignClient;

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationBySalonId(@PathVariable Long salonId) {
        List<Notification> notifications = notificationService.getAllNotificationBySalonId(salonId);

        List<NotificationDTO> notificationDTOS = notifications.stream()
                .map(n -> NotificationMapper.toDTO(n, safeBooking(n.getBookingId())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(notificationDTOS);
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
