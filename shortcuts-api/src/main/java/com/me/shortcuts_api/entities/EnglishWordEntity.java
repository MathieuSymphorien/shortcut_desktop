package com.me.shortcuts_api.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "english_word")
@Data
@AllArgsConstructor
public class EnglishWordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String theme;
    private String word;
    private String translation;
    private int learningLevel = 1;
}
