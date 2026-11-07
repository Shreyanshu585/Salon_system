package com.shree.Controller;

import com.shree.Model.User;
import com.shree.Model.UserMapper;
import com.shree.Payload.Response.DTO.UserDTO;
import com.shree.Repository.UserRepository;
import com.shree.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/api/users")
    public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
        User createUser = userService.createUser(user);
        return new ResponseEntity<>(createUser, HttpStatus.CREATED);
    }


    @GetMapping("/api/users")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getAllUser();
        return new ResponseEntity<>(users, HttpStatus.OK);

    }


    @GetMapping("/api/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) throws Exception {
        User user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/api/users/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable Long id) throws Exception {
        User Updateuser = userService.updateUser(id, user);
        return new ResponseEntity<>(Updateuser, HttpStatus.OK);
    }

    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long id) throws Exception {
        userService.deleteUser(id);
        return new ResponseEntity<>("user delete", HttpStatus.ACCEPTED);

    }
//    @GetMapping("/api/users/profile")
//    public ResponseEntity<User> getUserProfile(@RequestHeader ("Authorization") String jwt) throws Exception {
//
//        User user = userService.getUserFromJwt(jwt);
//        return new ResponseEntity<>(user, HttpStatus.CREATED);
//    }
@GetMapping("/api/users/profile")
public ResponseEntity<UserDTO> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.getUserFromJwt(jwt);

    if (user == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }

    return ResponseEntity.ok(UserMapper.toDTO(user));
}



}
