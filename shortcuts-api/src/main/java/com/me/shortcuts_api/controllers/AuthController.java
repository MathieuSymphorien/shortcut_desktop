package com.me.shortcuts_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.me.shortcuts_api.entities.DTO.AuthRequest;
import com.me.shortcuts_api.entities.DTO.AuthResponse;
import com.me.shortcuts_api.services.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        // Tente l'authentification
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // Si on arrive ici, c'est que le user/password sont valides
        String token = jwtService.generateToken(request.getUsername());

        return new AuthResponse(token);
    }
}
