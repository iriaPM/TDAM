//user service 
// to handle user reg, login, and profile details

package com.iria.tdam.backend.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.iria.tdam.backend.model.User;
import com.iria.tdam.backend.repository.UserRepository;
import com.iria.tdam.backend.dto.LoginRequest;
import com.iria.tdam.backend.dto.RegisterRequest;
import com.iria.tdam.backend.dto.UpdateProfileRequest;
import com.iria.tdam.backend.dto.UserProfileDto;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(RegisterRequest request) {

        // email regex validation
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // password rules
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password too short");
        }

        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new IllegalStateException("Email already in use");
        }

        if (userRepository.findByUsername(request.getUsername()) != null) {
            throw new IllegalStateException("Username already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        String token = UUID.randomUUID().toString();
        user.setToken(token);

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByEmailOrUsername(request.getIdentifier(), request.getIdentifier());

        if (user == null || !user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        user.setToken(UUID.randomUUID().toString());
        return userRepository.save(user);
    }

    public User getProfile(String token) {
        User user = userRepository.findByToken(token);
        if (user == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        return user;
    }

    public UserProfileDto getUserProfile(
            String token,
            Long profileUserId,
            CollectionService collectionService) {
        User currentUser = userRepository.findByToken(token);
        if (currentUser == null) {
            throw new IllegalArgumentException("Invalid token");
        }

        User profileUser = profileUserId == null
                ? currentUser
                : userRepository.findById(profileUserId)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserProfileDto dto = new UserProfileDto();
        dto.setId(profileUser.getId());
        dto.setUserName(profileUser.getUsername());
        dto.setDescription(profileUser.getDescription());
        dto.setAvatarUrl(profileUser.getAvatarUrl());
        dto.setMe(profileUser.getId().equals(currentUser.getId()));

        dto.setCollections(
                collectionService.getUserCollections(profileUser));

        return dto;
    }

    public User updateProfile(String token, UpdateProfileRequest request) {
        User user = userRepository.findByToken(token);
        if (user == null) {
            throw new IllegalArgumentException("Invalid token");
        }

        user.setUsername(request.getUserName());
        user.setDescription(request.getDescription());

        return userRepository.save(user);
    }

}
