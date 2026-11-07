package com.shree.dto;

import lombok.Data;

@Data
public class BookingNotificationDTO {
    private Long bookingId;
    private Long userId;      // who the notification is FOR
    private Long salonId;
    private String description;
    private String type;      // BOOKING_CONFIRMED | BOOKING_DECLINED
}
