package com.me.shortcuts_api.entities.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EnglishWordDTO {
    private Long id;
    private Long theme;
    private String word;
    private String translation;
    private int learningLevel;
    private Boolean isDeleted;
}
