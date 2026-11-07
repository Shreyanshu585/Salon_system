package com.shree.payload.dto;


import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import lombok.Data;

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
    private Long ownerId;
    private LocalTime openTime;
    private LocalTime closeTime;


}
