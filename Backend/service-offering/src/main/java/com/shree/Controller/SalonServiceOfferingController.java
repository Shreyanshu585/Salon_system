package com.shree.Controller;

import com.shree.Model.ServiceOffering;
import com.shree.Service.ServiceOfferingService;
import com.shree.Service.client.CategoryFeignClient;
import com.shree.Service.client.SalonFeignClient;
import com.shree.dto.CategoryDTO;
import com.shree.dto.SalonDTO;
import com.shree.dto.ServiceDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/service-offering/salon-owner")
public class SalonServiceOfferingController {
public final ServiceOfferingService serviceOfferingService;
private final SalonFeignClient salonFeignClient;
private final CategoryFeignClient categoryFeignClient;

    @PostMapping
    public ResponseEntity<ServiceOffering> createService(
            @RequestBody ServiceDTO serviceDTO,
            @RequestHeader ("Authorization") String jwt) throws Exception {
        SalonDTO salonDTO= salonFeignClient.getSalonOwnerById(jwt).getBody();

        CategoryDTO categoryDTO= categoryFeignClient.getCategoriesByIdAndSalon(serviceDTO.getCategory(),salonDTO.getId()).getBody();


        ServiceOffering serviceOfferings = serviceOfferingService.createService(salonDTO,serviceDTO,categoryDTO);
        return ResponseEntity.ok(serviceOfferings);
    }


    @PostMapping("/{id}")
    public ResponseEntity<ServiceOffering> updateService(
           @PathVariable Long id, @RequestBody ServiceOffering serviceOffering) throws Exception {

        ServiceOffering serviceOfferings = serviceOfferingService.updateService(id,serviceOffering);
        return ResponseEntity.ok(serviceOfferings);
    }

}
