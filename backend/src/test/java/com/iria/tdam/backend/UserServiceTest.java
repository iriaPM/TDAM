package com.iria.tdam.backend;

import com.iria.tdam.backend.dto.LoginRequest;
import com.iria.tdam.backend.dto.RegisterRequest;
import com.iria.tdam.backend.model.User;
import com.iria.tdam.backend.repository.UserRepository;
import com.iria.tdam.backend.services.CollectionService;
import com.iria.tdam.backend.services.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CollectionService collectionService;

    @InjectMocks
    private UserService userService;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;

    @BeforeEach
    void setUp() {
        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setUsername("testuser");
        validRegisterRequest.setEmail("test@email.com");
        validRegisterRequest.setPassword("password123");

        validLoginRequest = new LoginRequest();
        validLoginRequest.setIdentifier("testuser");
        validLoginRequest.setPassword("password123");
    }

    //  register 
    @Test
    void register_successfullyRegistersUserAndGeneratesToken() {
        when(userRepository.findByEmail("test@email.com")).thenReturn(null);
        when(userRepository.findByUsername("testuser")).thenReturn(null);
        when(userRepository.save(argThat(u -> u.getUsername().equals("testuser"))))
                .thenAnswer(i -> (User) i.getArgument(0));

        User result = userService.register(validRegisterRequest);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertNotNull(result.getToken());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_throwsIfEmailAlreadyInUse() {
        when(userRepository.findByEmail("test@email.com")).thenReturn(new User());

        assertThrows(IllegalStateException.class, () -> userService.register(validRegisterRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_throwsIfPasswordTooShort() {
        validRegisterRequest.setPassword("12345");
        assertThrows(IllegalArgumentException.class, () -> userService.register(validRegisterRequest));
    }

    //  login 
    @Test
    void login_successfullyLogsInAndGeneratesNewToken() {
        User mockUser = new User();
        mockUser.setPassword("password123");
        mockUser.setToken("old-token");

        when(userRepository.findByEmailOrUsername("testuser", "testuser")).thenReturn(mockUser);
        when(userRepository.save(mockUser)).thenAnswer(i -> (User) i.getArgument(0));

        User result = userService.login(validLoginRequest);

        assertNotNull(result.getToken());
        assertNotEquals("old-token", result.getToken());
    }

    @Test
    void login_throwsIfPasswordWrong() {
        User mockUser = new User();
        mockUser.setPassword("differentpassword");

        when(userRepository.findByEmailOrUsername("testuser", "testuser")).thenReturn(mockUser);

        assertThrows(IllegalArgumentException.class, () -> userService.login(validLoginRequest));
    }

    @Test
    void login_throwsIfUserNotFound() {
        when(userRepository.findByEmailOrUsername("testuser", "testuser")).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> userService.login(validLoginRequest));
    }

    //  getProfile 
    @Test
    void getProfile_returnsUserForValidToken() {
        User mockUser = new User();
        mockUser.setUsername("testuser");

        when(userRepository.findByToken("valid-token")).thenReturn(mockUser);

        User result = userService.getProfile("valid-token");

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
    }
}