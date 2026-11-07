package com.shree.Payload.Response.DTO;

import com.shree.Domain.UserRole;
import lombok.Data;

@Data
public class SignupDTO {

    private String fullName;
    private String email;
    private String password;
    private String username;
    private UserRole role;




}
