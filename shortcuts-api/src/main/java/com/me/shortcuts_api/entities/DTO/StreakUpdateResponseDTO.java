package com.me.shortcuts_api.entities.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StreakUpdateResponseDTO {
    private int currentStreak;
    private int maxStreak;
    private int jokersLeft;
    private boolean jokerUsed;
    private boolean streakReset;
}