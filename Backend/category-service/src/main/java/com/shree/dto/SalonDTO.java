package com.shree.dto;


import lombok.Data;
import org.hibernate.validator.constraints.UniqueElements;

import java.time.LocalTime;
import java.util.List;
@Data
public class SalonDTO {
    private Long id;
    private String name;
    private List<String> images;
    private String address;
    private String city;
    private String phoneNumber;
    private String email;
    @UniqueElements
    private Long ownerId;
    private LocalTime openTime;
    private LocalTime closeTime;


}
