package com.shree.Service;

import com.shree.Model.User;


import java.util.List;

public interface UserService {

    User createUser(User user);

    User getUserById(Long id) throws Exception;

    List<User> getAllUser();

    void deleteUser(Long id) throws Exception;

    User updateUser(Long id, User user) throws Exception;

    User getUserFromJwt(String token ) throws Exception;


}
