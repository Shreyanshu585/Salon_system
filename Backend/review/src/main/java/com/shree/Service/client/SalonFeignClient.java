package com.shree.Service.client;

import com.shree.payload.dto.SalonDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient("SALON-SERVICE")
public interface SalonFeignClient {


    @GetMapping("/api/salons/owner")
    public ResponseEntity<SalonDTO> getSalonOwnerById(@RequestHeader("Authorization") String jwt
    ) throws Exception;

    @GetMapping("/api/salons/{salonId}")
    public ResponseEntity<SalonDTO> getSalonById(@PathVariable Long salonId
    ) throws Exception;
}
