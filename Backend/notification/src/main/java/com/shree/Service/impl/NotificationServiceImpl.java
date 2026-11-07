package com.shree.Service.impl;

import com.shree.Mapper.NotificationMapper;
import com.shree.Model.Notification;
import com.shree.Repository.NotificationRepository;
import com.shree.Service.NotificationService;
import com.shree.Service.client.BookingFeignClient;
import com.shree.payload.dto.BookingDTO;
import com.shree.payload.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final BookingFeignClient bookingFeignClient;

    @Override
    public NotificationDTO createNotification(Notification notification) throws Exception {
        // One notification per booking per type. A repeated payment confirmation
        // or a RabbitMQ redelivery must not create a second copy.
        Notification already = notificationRepository.findFirstByBookingIdAndType(
                notification.getBookingId(), notification.getType());
        if (already != null) {
            return NotificationMapper.toDTO(already, null);
        }

        Notification saveNotification = notificationRepository.save(notification);

        // The row is already saved. If the booking lookup fails we must NOT throw:
        // an exception here makes RabbitMQ redeliver the same message forever,
        // saving a duplicate notification on every retry.
        BookingDTO bookingDTO = null;
        try {
            bookingDTO = bookingFeignClient.getBookingById(saveNotification.getBookingId()).getBody();
        } catch (Exception ignored) {
        }

        return NotificationMapper.toDTO(saveNotification, bookingDTO);
    }

    @Override
    public List<Notification> getAllNotificationByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    @Override
    public List<Notification> getAllNotificationBySalonId(Long salonId) {
        return notificationRepository.findBySalonId(salonId);
    }

    @Override
    public Notification markNotificationAsRead(Long notificationId) throws Exception {
        return notificationRepository.findById(notificationId).map(
                notification -> {
                    notification.setIsRead(true);
                    return  notificationRepository.save(notification);
                }
        ).orElseThrow(()-> new Exception("Notification not found"));
    }
}
