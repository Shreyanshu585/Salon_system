package com.shree.Service.impl;

import com.shree.Model.Salon;
import com.shree.Repository.SalonRepository;
import com.shree.Service.SalonService;
import com.shree.payload.dto.SalonDTO;
import com.shree.payload.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalonServiceImpl implements SalonService {

    private final SalonRepository salonRepository;

    @Override
    public Salon createSalon(SalonDTO sal, UserDTO user) {
        Salon salon = new Salon();
        salon.setName(sal.getName());
        salon.setImages(sal.getImages());
        salon.setEmail(sal.getEmail());
        salon.setAddress(sal.getAddress());
        salon.setCity(sal.getCity());
        salon.setOpenTime(sal.getOpenTime());
        salon.setCloseTime(sal.getCloseTime());
        salon.setPhoneNumber(sal.getPhoneNumber());
        salon.setOwnerId(user.getOwnerId());
        return salonRepository.save(salon);
    }

    @Override
    public Salon updateSalon(SalonDTO sal, UserDTO user, Long salonId) throws Exception {
        Salon salon = salonRepository.findById(salonId).orElse(null);
        if(!salon.getOwnerId().equals(user.getId())){
            throw new Exception("you don't have access to update");
        }
if(salon!=null) {
    salon.setImages(sal.getImages());
    salon.setEmail(sal.getEmail());
    salon.setAddress(sal.getAddress());
    salon.setCity(sal.getCity());
    salon.setOpenTime(sal.getOpenTime());
    salon.setCloseTime(sal.getCloseTime());
    salon.setPhoneNumber(sal.getPhoneNumber());
    salon.setOwnerId(user.getOwnerId());
    return salonRepository.save(salon);
}
throw new Exception("salon not exist....");
    }

    @Override
    public List<Salon> getAllSalon() {
        return salonRepository.findAll();
    }

    @Override
    public Salon getSalonById(Long salonId) throws Exception {
        Salon salon = salonRepository.findById(salonId).orElse(null);
        if(salon == null){
            throw new Exception("salon not exist");
        }
        return salon;
    }

    @Override
    public Salon getSalonByOwnerId(Long ownerId) {
      return salonRepository.findByOwnerId(ownerId);

    }

    @Override
    public List<Salon> searchSalonByCity(String city) {
        return salonRepository.searchSalon(city);
    }
}
