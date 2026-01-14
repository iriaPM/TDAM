package com.iria.tdam.backend.services;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.iria.tdam.backend.model.User;
import com.iria.tdam.backend.repository.UserRepository;
import com.iria.tdam.backend.dto.LoginRequest;
import com.iria.tdam.backend.dto.RegisterRequest;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(RegisterRequest request) {

        // email regex validation
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }

        //password rules
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

        User user = userRepository.findByEmail(request.getEmail());

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
}
