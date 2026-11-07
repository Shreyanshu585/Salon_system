package com.shree.Service.Impl;

import com.shree.Payload.Response.DTO.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class KeycloakService {
    private static final String KEYCLOAK_BASE_URL = "http://localhost:8080";
    private static final String KEYCLOAK_ADMIN_API = KEYCLOAK_BASE_URL + "/admin/realms/master/users";

    private static final String TOKEN_URL = KEYCLOAK_BASE_URL + "/realms/master/protocol/openid-connect/token";

    private static final String CLIENT_ID = "salon-booking-client";
    private static final String CLIENT_SECRET = "g3nFWIDLGuwiSsYf3ar57m5HAXzHHMCQ";
    private static final String GRANT_TYPE = "password";
    private static final String scope = "openid profile email";
    private static final String username = "shree";
    private static final String password = "admin";
    private static final String clientId = "7f1acfc8-6f27-4719-95b0-431f1606deea";


    private static final RestTemplate restTemplate= new RestTemplate();

    public static void createUser(SignupDTO signupDTO) throws Exception {

        String ACCESS_TOKEN = getAdminAccessToken(username, password, GRANT_TYPE, null).getAccessToken();

        Credential credential = new Credential();
        credential.setTemporary(false);
        credential.setType("password");
        credential.setValue(signupDTO.getPassword());


        UserRequest userRequest = new UserRequest();

        userRequest.setUsername(signupDTO.getUsername());
        userRequest.setEmail(signupDTO.getEmail());
        userRequest.setEnabled(true);
        userRequest.setFirstName(signupDTO.getFullName());
        userRequest.getCredentials().add(credential);


        HttpHeaders httpHeaders = new HttpHeaders();

        // Keycloak expects token requests as form-urlencoded data
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.setBearerAuth(ACCESS_TOKEN);


        HttpEntity<UserRequest> requestEntity = new HttpEntity<>(userRequest, httpHeaders);
        ResponseEntity<String> response = restTemplate.exchange(
                KEYCLOAK_ADMIN_API,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        if (response.getStatusCode() == HttpStatus.CREATED) {
            System.out.println("user created successfully");


            KeycloakUserDTO user = fetchFirstUserByUsername(signupDTO.getUsername(), ACCESS_TOKEN);

            KeycloakRole role = getRoleByName(clientId, ACCESS_TOKEN, signupDTO.getRole().toString());
            List<KeycloakRole> roles = new ArrayList<>();
            roles.add(role);

            assignRoleToUser(user.getId(), clientId, roles, ACCESS_TOKEN);

        } else {
            System.out.println("user creation failed");

            throw new Exception(response.getBody());
        }


    }

    public static TokenResponse getAdminAccessToken(String username,
                                                    String password,
                                                    String grantType,
                                                    String refreshToken) throws Exception {

        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();

        requestBody.add("grant_type", grantType);
        requestBody.add("username", username);
        requestBody.add("password", password);
        requestBody.add("refresh_token", refreshToken);
        requestBody.add("client_id", CLIENT_ID);
        requestBody.add("client_secret", CLIENT_SECRET);
        requestBody.add("scope", scope);


        HttpEntity<MultiValueMap<String, String>> requestEntity =
                new HttpEntity<>(requestBody, httpHeaders);
        ResponseEntity<TokenResponse> response = restTemplate.exchange(
                TOKEN_URL,
                HttpMethod.POST,
                requestEntity,
                TokenResponse.class
        );

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody();
        }
        throw new Exception("fail to access token");
    }

    public static KeycloakRole getRoleByName(String clientId, String token, String role) throws Exception {

        String url = KEYCLOAK_BASE_URL + "/admin/realms/master/clients/" + clientId + "/roles/" + role;
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Authorization", "Bearer " + token);
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);


        HttpEntity<Void> requestEntity =
                new HttpEntity<>(httpHeaders);
        ResponseEntity<KeycloakRole> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                KeycloakRole.class
        );

        if (response.getBody() != null) {
            return response.getBody();
        }
        throw new Exception("fail to get role");


    }


    public static KeycloakUserDTO fetchFirstUserByUsername(String username, String token) throws Exception {
        String url = KEYCLOAK_BASE_URL + "/admin/realms/master/users?username=" + username;
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(token);
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);


        HttpEntity<String> requestEntity =
                new HttpEntity<>(httpHeaders);
        ResponseEntity<KeycloakUserDTO[]> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                KeycloakUserDTO[].class
        );

        KeycloakUserDTO[] users = response.getBody();
        if (users != null && users.length > 0) {
            return users[0];
        }
        throw new Exception("user not found with username" + username);

    }


    public static void assignRoleToUser(String userId,
                                        String clientId, List<KeycloakRole> roles, String token) {
        String url = KEYCLOAK_BASE_URL + "/admin/realms/master/users/" + userId + "/role-mappings/clients/" + clientId;
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(token);
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);


        HttpEntity<List<KeycloakRole>> requestEntity =
                new HttpEntity<>(roles,httpHeaders);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );
        } catch (Exception e) {
            throw new RuntimeException("failed to assign new role" + e.getMessage());
        }


    }


    public  KeycloakUserDTO fetchUserprofileByJwt(String token)throws Exception{
        String url = KEYCLOAK_BASE_URL + "/realms/master/protocol/openid-connect/userinfo";
        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.set("Authorization", token);

        HttpEntity<String> requestEntity =
                new HttpEntity<>(httpHeaders);

        try {
            ResponseEntity<KeycloakUserDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestEntity,
                    KeycloakUserDTO.class
            );
           return response.getBody();
        } catch (Exception e) {

            throw new RuntimeException("failed to get user info" + e.getMessage());
        }

    }

}
