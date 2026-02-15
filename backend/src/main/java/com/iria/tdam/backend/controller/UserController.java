//User controller
// align api call from frontend 
package com.iria.tdam.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.iria.tdam.backend.model.User;
import com.iria.tdam.backend.dto.LoginRequest;
import com.iria.tdam.backend.dto.RegisterRequest;
import com.iria.tdam.backend.dto.UpdateProfileRequest;
import com.iria.tdam.backend.services.UserService;
import com.iria.tdam.backend.services.CollectionService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final CollectionService collectionService;

    public UserController(UserService userService, CollectionService collectionService) {
        this.userService = userService;
        this.collectionService = collectionService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(userService.register(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/users/profile")
    public ResponseEntity<?> getProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Long id) {
        try {
            String token = authHeader.replace("Bearer ", "");
            return ResponseEntity.ok(
                    userService.getUserProfile(token, id, collectionService));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    @PutMapping("/users/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            return ResponseEntity.ok(
                    userService.updateProfile(token, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

}