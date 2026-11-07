package com.shree.Service;

import com.shree.Payload.Response.AuthResponse;
import com.shree.Payload.Response.DTO.SignupDTO;

public interface AuthService {
AuthResponse login(String username,String password) throws Exception;
AuthResponse signup (SignupDTO req) throws Exception;
AuthResponse getAccessTokenFromRefreshToken(String refreshToken) throws Exception;






}
