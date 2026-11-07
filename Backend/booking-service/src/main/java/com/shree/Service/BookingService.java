package com.shree.Service;

import com.shree.Domain.BookingStatus;
import com.shree.Model.Booking;
import com.shree.Model.PaymentOrder;
import com.shree.Model.SalonReport;
import com.shree.dto.BookingRequest;
import com.shree.dto.SalonDTO;
import com.shree.dto.ServiceDTO;
import com.shree.dto.UserDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface BookingService {

    Booking createBooking(BookingRequest booking,
                          UserDTO user,
                          SalonDTO salon,
                          Set<ServiceDTO> serviceDTOSet) throws Exception;

    List<Booking> getBookingsByCustomer(Long customerId);

    List<Booking> getBookingsBySalon(Long salonId);

    Booking getBookingById(Long id) throws Exception;

    Booking updateBooking(Long bookingId, BookingStatus status) throws Exception;

    List<Booking> getBookingByDate(LocalDate date, Long salonId);

    SalonReport getSalonReport(Long salonId);

   Booking  bookingSuccess(PaymentOrder order) throws Exception;


}
