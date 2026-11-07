package com.shree.Controller;

import com.shree.Payload.Response.AuthResponse;
import com.shree.Payload.Response.DTO.LoginDTO;
import com.shree.Payload.Response.DTO.SignupDTO;
import com.shree.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;


    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> Signup(@RequestBody SignupDTO request) throws Exception {
        AuthResponse response= authService.signup(request);
   return  ResponseEntity.ok(response);
    }

@PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO request) throws Exception {
        AuthResponse response= authService.login(request.getEmail(),request.getPassword());

        return  ResponseEntity.ok(response);
    }

    @GetMapping("/access-token/refresh-token/{refreshToken}")
    public ResponseEntity<AuthResponse> getAccessToken(@PathVariable String refreshToken) throws Exception {
        AuthResponse response= authService.getAccessTokenFromRefreshToken(refreshToken);
        return  ResponseEntity.ok(response);
    }
}
