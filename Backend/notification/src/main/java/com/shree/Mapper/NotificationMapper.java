package com.shree.Mapper;

import com.shree.Model.Notification;
import com.shree.payload.dto.BookingDTO;
import com.shree.payload.dto.NotificationDTO;

public class NotificationMapper {

  public static NotificationDTO toDTO(Notification notification , BookingDTO bookingDTO){
      NotificationDTO notificationDTO = new NotificationDTO();
      notificationDTO.setId(notification.getId());
  notificationDTO.setType(notification.getType());
notificationDTO.setIsRead(notification.getIsRead());
  notificationDTO.setDescription(notification.getDescription());
  notificationDTO.setBookingId(notification.getBookingId());
  notificationDTO.setUserId(notification.getUserId());
  notificationDTO.setSalonId(notification.getSalonId());
notificationDTO.setCreatedAt(notification.getCreatedAt());
      notificationDTO.setBooking(bookingDTO);

return notificationDTO;

  }

}
