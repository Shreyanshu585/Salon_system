package com.shree.Service;

import com.shree.Domain.BookingStatus;
import com.shree.Model.Booking;
import com.shree.Model.PaymentOrder;
import com.shree.Model.SalonReport;
import com.shree.Repository.BookingRepository;
import com.shree.dto.BookingRequest;
import com.shree.dto.SalonDTO;
import com.shree.dto.ServiceDTO;
import com.shree.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;

    @Override
    public Booking createBooking(BookingRequest booking,
                                 UserDTO user,
                                 SalonDTO salon,
                                 Set<ServiceDTO> serviceDTOSet) throws Exception {
        int totalDuration = serviceDTOSet.stream()
                .mapToInt(ServiceDTO::getDuration)
                .sum();

        LocalDateTime bookingStartTime = booking.getStartTime();
        LocalDateTime bookingEndTime = bookingStartTime.plusMinutes(totalDuration);

        if (bookingStartTime.isBefore(LocalDateTime.now())) {
            throw new Exception("You can't book a time that has already passed.");
        }


        Boolean isSlotAvailable = isTimeSlotAvailable(salon, bookingStartTime, bookingEndTime);
        if (!isTimeSlotAvailable(salon, bookingStartTime, bookingEndTime)) {
            throw new Exception("Slot not available");
        }
        System.out.println("Services = " + serviceDTOSet);

        serviceDTOSet.forEach(service -> {
            System.out.println("Service Id = " + service.getId());
            System.out.println("Service Price = " + service.getPrice());
        });
        int totalPrice = serviceDTOSet.stream()
                .mapToInt(ServiceDTO::getPrice)
                .sum();
        System.out.println("Calculated Total Price = " + totalPrice);
        Set<Long> idList = serviceDTOSet.stream()
                .map(ServiceDTO::getId)
                .collect(Collectors.toSet());


        Booking newBooking = new Booking();
        newBooking.setCustomerId(user.getId());
        newBooking.setSalonId(salon.getId());
        newBooking.setServiceIds(idList);
        newBooking.setStatus(BookingStatus.PENDING);
        newBooking.setStartTime(bookingStartTime);
        newBooking.setEndTime(bookingEndTime);
        newBooking.setTotalPrice(totalPrice);

        return bookingRepository.save(newBooking);
    }


    public Boolean isTimeSlotAvailable(SalonDTO salonDTO,
                                       LocalDateTime bookingStartTime,
                                       LocalDateTime bookingEndTime) throws Exception {

        List<Booking> existBookings = getBookingsBySalon(salonDTO.getId()).stream().filter(this::holdsSlot).collect(Collectors.toList());
        LocalDateTime salonOpenTime = salonDTO.getOpenTime().atDate(bookingStartTime.toLocalDate());
        LocalDateTime salonCloseTime = salonDTO.getCloseTime().atDate(bookingStartTime.toLocalDate());
        log.info("Start: {}", bookingStartTime);
        log.info("End: {}", bookingEndTime);
        log.info("Salon hours: {} - {}", salonOpenTime, salonCloseTime);
        log.info("SalonDTO closeTime raw: {}", salonDTO.getCloseTime());
        //  log.info("Service durations: {}", serviceDTO.stream().map(ServiceDTO::getDuration).toList());

        if (bookingStartTime.isBefore(salonOpenTime) || bookingEndTime.isAfter(salonCloseTime)) {
            throw new Exception("Booking time must be within salon's working hours");
        }

        for (Booking existingBooking : existBookings) {
            LocalDateTime existingBookingStartTime = existingBooking.getStartTime();
            LocalDateTime existingBookingEndTime = existingBooking.getEndTime();

            if (bookingStartTime.isBefore(existingBookingEndTime)
                    && bookingEndTime.isAfter(existingBookingStartTime)) {
                throw new Exception("slot not available , choose different time.");
            }
            if (bookingStartTime.isEqual(existingBookingStartTime) || bookingEndTime.isEqual(existingBookingEndTime)) {
                throw new Exception("slot not available , choose different time.");
            }
        }
        return true;
    }


    @Override
    public List<Booking> getBookingsByCustomer(Long customerId) {

        return bookingRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Booking> getBookingsBySalon(Long salonId) {
        return bookingRepository.findBySalonId(salonId);
    }

    @Override
    public Booking getBookingById(Long id) throws Exception {

        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            throw new Exception("booking not found");
        }
        return booking;
    }

    @Override
    public Booking updateBooking(Long bookingId, BookingStatus status) throws Exception {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getBookingByDate(LocalDate date, Long salonId) {
        List<Booking> allBookings= getBookingsBySalon(salonId);
        if(date==null){
            return allBookings;
        }

        return allBookings.stream()
                .filter(this::holdsSlot)
                .filter(booking -> isSameDate(booking.getStartTime().toLocalDate(),date) ||
                        isSameDate(booking.getEndTime().toLocalDate(),date))
                .collect(Collectors.toList());

    }

    private boolean isSameDate(LocalDate date, LocalDate localDate) {
        return localDate.isEqual(date);
    }

    @Override
    public SalonReport getSalonReport(Long salonId) {
        List<Booking> bookings = getBookingsBySalon(salonId);

        // An unpaid PENDING booking is only an abandoned checkout, not a real booking.
        List<Booking> real = bookings.stream()
                .filter(b -> !(b.getStatus().equals(BookingStatus.PENDING) && !Boolean.TRUE.equals(b.getPaid())))
                .collect(Collectors.toList());

        List<Booking> cancelled = real.stream()
                .filter(b -> b.getStatus().equals(BookingStatus.CANCELLED))
                .collect(Collectors.toList());

        // Earnings count only bookings the owner CONFIRMED.
        int totalEarning = real.stream()
                .filter(b -> b.getStatus().equals(BookingStatus.CONFIRMED))
                .mapToInt(Booking::getTotalPrice)
                .sum();

        Double totalRefund = cancelled.stream().mapToDouble(Booking::getTotalPrice).sum();

        SalonReport report = new SalonReport();
        report.setSalonId(salonId);
        report.setTotalBooking(real.size());
        report.setCancelledBooking(cancelled.size());
        report.setTotalEarning(totalEarning);
        report.setTotalRefund(totalRefund);
        return report;
    }

    @Override
    public Booking bookingSuccess(PaymentOrder order) throws Exception {

        Booking existing = getBookingById(order.getBookingId());
        existing.setPaid(true);   // stays PENDING until the owner confirms or declines
        return bookingRepository.save(existing);
    }

    // How long an UNPAID booking keeps its time slot while the customer is paying.
    private static final long UNPAID_HOLD_MINUTES = 5;

    // Does this booking currently block its time slot?
    private boolean holdsSlot(Booking b) {
        if (b.getStatus().equals(BookingStatus.CANCELLED)) return false;   // gave the time back
        if (b.getStatus().equals(BookingStatus.CONFIRMED)) return true;
        if (Boolean.TRUE.equals(b.getPaid())) return true;                 // paid, waiting for the owner
        // Unpaid PENDING: hold the slot only briefly. If the customer cancelled the
        // payment page or never paid, the slot frees itself after the hold expires.
        return b.getCreatedAt() != null
                && b.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(UNPAID_HOLD_MINUTES));
    }
}
