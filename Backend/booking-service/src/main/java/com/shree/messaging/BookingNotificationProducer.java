package com.shree.messaging;

import com.shree.dto.BookingNotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

/** Sends "the salon confirmed / declined your booking" to the customer. */
@Component
@RequiredArgsConstructor
public class BookingNotificationProducer {

    private final RabbitTemplate rabbitTemplate;

    public void notifyCustomer(Long bookingId, Long customerId, Long salonId, boolean confirmed) {
        BookingNotificationDTO dto = new BookingNotificationDTO();
        dto.setBookingId(bookingId);
        dto.setUserId(customerId);
        dto.setSalonId(salonId);
        dto.setType(confirmed ? "BOOKING_CONFIRMED" : "BOOKING_DECLINED");
        dto.setDescription(confirmed
                ? "Your booking #" + bookingId + " was confirmed by the salon."
                : "Your booking #" + bookingId + " was declined by the salon.");
        rabbitTemplate.convertAndSend("notification-queue", dto);
    }
}