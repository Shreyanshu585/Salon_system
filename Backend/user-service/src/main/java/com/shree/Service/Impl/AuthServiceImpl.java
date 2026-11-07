package com.shree.Service.Impl;

import com.shree.Model.User;
import com.shree.Payload.Response.AuthResponse;
import com.shree.Payload.Response.DTO.SignupDTO;
import com.shree.Payload.Response.DTO.TokenResponse;
import com.shree.Repository.UserRepository;
import com.shree.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final KeycloakService keycloakService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public AuthResponse login(String username, String password) throws Exception {

        TokenResponse tokenResponse = keycloakService.getAdminAccessToken(username, password, "password", null);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setRefresh_token(tokenResponse.getRefreshToken());
        authResponse.setJwt(tokenResponse.getAccessToken());
        authResponse.setMessage("login success");

        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new Exception("User not found");
        }
        authResponse.setRole(user.getRole());

        return authResponse;
    }

    @Override
    public AuthResponse signup(SignupDTO req) throws Exception {
        KeycloakService.createUser(req);

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(req.getPassword());
        user.setEmail(req.getEmail());
        user.setRole(req.getRole());
        user.setFullName(req.getFullName());
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        TokenResponse tokenResponse = keycloakService.getAdminAccessToken(req.getUsername(), req.getPassword(), "password", null);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setRefresh_token(tokenResponse.getRefreshToken());
        authResponse.setJwt(tokenResponse.getAccessToken());
        authResponse.setRole(user.getRole());
        authResponse.setMessage("Register success");

        return authResponse;
    }

    @Override
    public AuthResponse getAccessTokenFromRefreshToken(String refreshToken) throws Exception {
        TokenResponse tokenResponse = keycloakService.getAdminAccessToken(null, null, "refresh_token", refreshToken);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setRefresh_token(tokenResponse.getRefreshToken());
        authResponse.setJwt(tokenResponse.getAccessToken());
        authResponse.setMessage("login success");

        String email = extractEmailFromJwt(tokenResponse.getAccessToken());
        User user = userRepository.findByEmail(email);
        if (user != null) {
            authResponse.setRole(user.getRole());
        }

        return authResponse;
    }

    @SuppressWarnings("unchecked")
    private String extractEmailFromJwt(String jwt) throws Exception {
        String payload = jwt.split("\\.")[1];
        String json = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
        Map<String, Object> claims = objectMapper.readValue(json, Map.class);
        return (String) claims.get("email");
    }
}