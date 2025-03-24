package com.me.shortcuts_api.entities;


import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    private int currentStreak;
    private int maxStreak;
    private LocalDate lastActivityDate;
    private int jokersLeft;
    private LocalDate lastJokerResetDate;
}

