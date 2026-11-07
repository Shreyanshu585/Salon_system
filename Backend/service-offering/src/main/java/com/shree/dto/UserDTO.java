package com.shree.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;

    public Long getOwnerId() {
   return id;
    }
}
