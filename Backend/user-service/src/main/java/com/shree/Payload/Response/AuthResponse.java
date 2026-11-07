package com.shree.Payload.Response;

import com.shree.Domain.UserRole;
import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String refresh_token;
    private String message ;
    private String title;
    private UserRole role;
}
