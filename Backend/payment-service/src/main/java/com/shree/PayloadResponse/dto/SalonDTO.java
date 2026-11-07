package com.shree.PayloadResponse.dto;


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
    private LocalTime openTime = LocalTime.of(9, 0);   // default 9 AM
    private LocalTime closeTime = LocalTime.of(22, 0);}


