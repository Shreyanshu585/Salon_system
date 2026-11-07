package com.shree.messaging;

import com.shree.PayloadResponse.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventProducer {

    private final RabbitTemplate rabbitTemplate;


    public void sentNotification(Long bookingId, Long userId ,Long salonId){

        NotificationDTO notificationDTO=new NotificationDTO();
        notificationDTO.setBookingId(bookingId);
        notificationDTO.setUserId(userId);
        notificationDTO.setSalonId(salonId);
        notificationDTO.setDescription("New paid booking #" + bookingId + " - please confirm or decline it.");
        notificationDTO.setType("NEW_BOOKING");

        rabbitTemplate.convertAndSend("notification-queue",notificationDTO);


    }



}
