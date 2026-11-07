package com.shree.Controller;

import com.shree.Domain.BookingStatus;
import com.shree.Domain.PaymentMethod;
import com.shree.Mapper.BookingMapper;
import com.shree.Model.Booking;
import com.shree.Model.SalonReport;
import com.shree.Repository.BookingRepository;
import com.shree.Service.BookingService;
import com.shree.Service.client.PaymentFeignClient;
import com.shree.Service.client.SalonFeignClient;
import com.shree.Service.client.ServiceOfferingFeignClient;
import com.shree.Service.client.UserFeignClient;
import com.shree.messaging.BookingNotificationProducer;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.shree.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/booking")
public class BookingController {

    private final BookingService bookingService;
    private final SalonFeignClient salonFeignClient;
    private final UserFeignClient userFeignClient;
    private final ServiceOfferingFeignClient serviceOfferingFeignClient;
    private final PaymentFeignClient paymentFeignClient;
    private final BookingRepository bookingRepository;
    private final BookingNotificationProducer bookingNotificationProducer;
    @PostMapping
    public ResponseEntity<PaymentLinkResponse> createBooking(
            @RequestParam Long salonId,
            @RequestParam PaymentMethod paymentMethod,
            @RequestBody BookingRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        SalonDTO salonDTO = salonFeignClient.getSalonById(salonId).getBody();

        System.out.println("Requested IDs = " + request.getServiceIds());
        Set<ServiceDTO> serviceDTOSet = serviceOfferingFeignClient.getServiceByIds(request.getServiceIds()).getBody();


        System.out.println("Received Services = " + serviceDTOSet);
        Booking booking = bookingService.createBooking(request, userDTO, salonDTO, serviceDTOSet);

        BookingDTO bookingDTO = BookingMapper.toDTO(booking);
        System.out.println("Booking Price = " + booking.getTotalPrice());
        System.out.println("DTO Price = " + bookingDTO.getTotalPrice());


        try {
            PaymentLinkResponse response =
                    paymentFeignClient.createPaymentLink(
                            bookingDTO,
                            paymentMethod,
                            jwt
                    ).getBody();


            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println(
                    "Payment creation failed. Deleting booking: "
                            + booking.getId()
            );
            bookingRepository.deleteById(booking.getId());

            throw e;
        }
        //PaymentLinkResponse response = paymentFeignClient.createPaymentLink(bookingDTO, paymentMethod, jwt).getBody();

        //return ResponseEntity.ok(response);
    }

    @GetMapping("/customer")
    public ResponseEntity<Set<BookingDTO>> getBookingByCustomer(@RequestHeader("Authorization") String jwt) throws Exception {
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();
        if (userDTO == null || userDTO.getId() == null) {
            throw new Exception("user not found fro jwt..");
        }

        List<Booking> booking = bookingService.getBookingsByCustomer(userDTO.getId());

        return ResponseEntity.ok(getBookingDTOs(booking));
    }

    private Set<BookingDTO> getBookingDTOs(List<Booking> bookings) {
        return bookings.stream()
                .map(booking -> {
                    return BookingMapper.toDTO(booking);
                }).collect(Collectors.toSet());
    }


    @GetMapping("/salons")
    public ResponseEntity<Set<BookingDTO>> getBookingBySalon(@RequestHeader("Authorization") String jwt) throws Exception {
        SalonDTO salon = salonFeignClient.getSalonOwnerById(jwt).getBody();
        List<Booking> booking = bookingService.getBookingsBySalon(salon.getId());

        return ResponseEntity.ok(getBookingDTOs(booking));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long bookingId) throws Exception {

        Booking booking = bookingService.getBookingById(bookingId);

        return ResponseEntity.ok(BookingMapper.toDTO(booking));
    }


    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO caller = userFeignClient.getUserProfile(jwt).getBody();
        Booking existing = bookingService.getBookingById(bookingId);
        SalonDTO salon = salonFeignClient.getSalonById(existing.getSalonId()).getBody();

        boolean isOwner = salon.getOwnerId() != null && salon.getOwnerId().equals(caller.getId());
        boolean isCustomer = existing.getCustomerId() != null && existing.getCustomerId().equals(caller.getId());

        if (isOwner) {
            // paid + still PENDING = waiting for the owner's decision
            boolean waitingForOwner = existing.getStatus() == BookingStatus.PENDING
                    && Boolean.TRUE.equals(existing.getPaid());
            if (status == BookingStatus.CONFIRMED && !waitingForOwner) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Only a paid booking that is waiting for your decision can be confirmed");
            }
            if (status != BookingStatus.CONFIRMED && status != BookingStatus.CANCELLED) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Owners can only confirm or decline a booking");
            }
        } else if (isCustomer) {
            if (status != BookingStatus.CANCELLED) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Customers can only cancel their own booking");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }

        Booking booking = bookingService.updateBooking(bookingId, status);

        // tell the customer what the owner decided
        if (isOwner) {
            bookingNotificationProducer.notifyCustomer(
                    booking.getId(), booking.getCustomerId(), booking.getSalonId(),
                    status == BookingStatus.CONFIRMED);
        }

        return ResponseEntity.ok(BookingMapper.toDTO(booking));
    }
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status) throws Exception {

        Booking booking = bookingService.updateBooking(bookingId, status);
        return ResponseEntity.ok(BookingMapper.toDTO(booking));
    }


    @GetMapping("/slots/salon/{salonId}/date/{date}")
    public ResponseEntity<List<BookingSlotDTO>> getBookedSlot(@PathVariable Long salonId, @PathVariable LocalDate date) throws Exception {

        List<Booking> bookings = bookingService.getBookingByDate(date, salonId);
        List<BookingSlotDTO> slotDTOS = bookings.stream()
                .map(booking -> {
                    BookingSlotDTO slotDTO = new BookingSlotDTO();
                    slotDTO.setStartTime(booking.getStartTime());
                    slotDTO.setEndTime(booking.getEndTime());
                    return slotDTO;
                }).collect(Collectors.toList());
        return ResponseEntity.ok(slotDTOS);
    }


    @GetMapping("/report")
    public ResponseEntity<SalonReport> getSalonReport(@RequestHeader("Authorization") String jwt) throws Exception {

        SalonDTO salon = salonFeignClient.getSalonOwnerById(jwt).getBody();
        SalonReport salonReport = bookingService.getSalonReport(salon.getId());

        return ResponseEntity.ok(salonReport);
    }
}
