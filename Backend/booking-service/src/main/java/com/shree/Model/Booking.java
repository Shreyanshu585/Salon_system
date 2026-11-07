package com.shree.Model;

import com.shree.Domain.BookingStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long salonId;
    private Long customerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    @ElementCollection
    private Set<Long> serviceIds;
    private BookingStatus status = BookingStatus.PENDING;
    private int totalPrice;
    // true once payment is verified; status stays PENDING until the owner decides
    private Boolean paid = false;
    // used to let an UNPAID booking hold its slot only briefly
    private LocalDateTime createdAt;

    @PrePersist
    void setCreatedAtOnInsert() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }


}
