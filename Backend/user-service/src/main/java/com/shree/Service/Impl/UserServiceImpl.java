package com.shree.Service.Impl;

import com.shree.Model.User;
import com.shree.Payload.Response.DTO.KeycloakUserDTO;
import com.shree.Repository.UserRepository;
import com.shree.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) throws Exception {
        Optional<User> ot = userRepository.findById(id);
        if (ot.isPresent()) {
            return ot.get();
        }
        throw new Exception("user not found");

    }

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long id) throws Exception {
        Optional<User> ot = userRepository.findById(id);
        if (ot.isEmpty()) {
            throw new Exception("user not found by this id" + id);
        }
        userRepository.deleteById(ot.get().getId());

    }

    @Override
    public User updateUser(Long id, User user) throws Exception {
        Optional<User> ot = userRepository.findById(id);
        if (ot.isEmpty()) {
            throw new Exception("user not found by this id" + id);
        }

        User existUser = ot.get();

        existUser.setFullName(user.getFullName());
        existUser.setEmail(user.getEmail());
        existUser.setRole(user.getRole());
        existUser.setPhone(user.getPhone());
        return userRepository.save(existUser);
    }

    @Override
    public User getUserFromJwt(String jwt) throws Exception {
        KeycloakUserDTO keycloakUserDTO = keycloakService.fetchUserprofileByJwt(jwt);
        System.out.println("Keycloak Email = " + keycloakUserDTO.getEmail());

        User user = userRepository.findByEmail(keycloakUserDTO.getEmail());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "User not found for email: " + keycloakUserDTO.getEmail());
        }

        System.out.println("DB User = " + user);
        return user;
    }

//    @Override
//    public User getUserFromJwt(String jwt) throws Exception {
//        String token = jwt.replace("Bearer ", "");
//        KeycloakUserDTO keycloakUserDTO =keycloakService.fetchUserprofileByJwt(jwt);
//
//      return userRepository.findByEmail(keycloakUserDTO.getEmail());
//
//    }
}
