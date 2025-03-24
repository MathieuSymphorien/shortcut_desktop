package com.me.shortcuts_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.me.shortcuts_api.entities.DTO.StreakUpdateResponseDTO;
import com.me.shortcuts_api.services.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("streak/{userId}")
    public ResponseEntity<StreakUpdateResponseDTO> updateStreak(@PathVariable Long userId) {
        StreakUpdateResponseDTO response = userService.updateStreak(userId);
        return ResponseEntity.ok(response);
    }
}
