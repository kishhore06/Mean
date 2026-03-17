package com.blog.mean.service.serviceimpl;

import com.blog.application.dto.UserDTO;
import com.blog.application.entity.User;
import com.blog.application.exception.ResourceNotFoundException;
import com.blog.application.repository.UserRepository;
import com.blog.application.service.UserService;
import com.blog.application.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final MapperUtil mapperUtil;
    
    @Override
    public UserDTO createUser(User user) {
        User savedUser = userRepository.save(user);
        return mapperUtil.mapToUserDTO(savedUser);
    }
    
    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapperUtil.mapToUserDTO(user);
    }
    
    @Override
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return mapperUtil.mapToUserDTO(user);
    }
    
    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(mapperUtil::mapToUserDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public UserDTO updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setPassword(userDetails.getPassword());
        user.setBio(userDetails.getBio());
        
        User updatedUser = userRepository.save(user);
        return mapperUtil.mapToUserDTO(updatedUser);
    }
    
    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
    
    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
