package com.shree.Model;

import com.shree.Payload.Response.DTO.UserDTO;
import lombok.Data;

@Data
public class UserMapper {

        public static UserDTO toDTO(User user) {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setFullName(user.getFullName());
            dto.setEmail(user.getEmail());
            return dto;
        }
    }


