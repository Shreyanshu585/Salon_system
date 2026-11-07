package com.shree.Model;

import lombok.Data;

@Data
public class SalonReport  {
    private Long salonId;
    private String salonName;
    private int totalEarning;
    private Integer totalBooking;
    private Integer cancelledBooking;
    private Double totalRefund;





}
