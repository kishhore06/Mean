package com.blog.mean.service;

import com.blog.mean.dto.UserDTO;
import com.blog.mean.entity.User;
import java.util.List;

public interface UserService {
    UserDTO createUser(User user);
    UserDTO getUserById(Long id);
    UserDTO getUserByUsername(String username);
    List<UserDTO> getAllUsers();
    UserDTO updateUser(Long id, User user);
    void deleteUser(Long id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
