package com.example.vehiclerental.controller;

import com.example.vehiclerental.dto.AuthRequest;
import com.example.vehiclerental.dto.AuthResponse;
import com.example.vehiclerental.entity.User;
import com.example.vehiclerental.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody User user) {
        User created = userService.registerUser(user);
        // Generate mock token for session simulation
        String token = "jwt_token_" + created.getId() + "_" + created.getRole();
        return new ResponseEntity<>(new AuthResponse(token, created), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        User user = userService.authenticate(request.getEmail(), request.getPassword());
        String token = "jwt_token_" + user.getId() + "_" + user.getRole();
        return ResponseEntity.ok(new AuthResponse(token, user));
    }
}
