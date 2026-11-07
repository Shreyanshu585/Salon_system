package com.shree.Service;

import com.shree.Model.Salon;
import com.shree.payload.dto.SalonDTO;
import com.shree.payload.dto.UserDTO;

import java.util.List;

public interface SalonService {
    Salon createSalon(SalonDTO salon, UserDTO user);

    Salon updateSalon(SalonDTO salon,UserDTO user,Long salonId) throws Exception;

    List<Salon> getAllSalon();
    Salon getSalonById(Long salonId) throws Exception;
    Salon getSalonByOwnerId(Long ownerId);
    List<Salon> searchSalonByCity(String city);

}
