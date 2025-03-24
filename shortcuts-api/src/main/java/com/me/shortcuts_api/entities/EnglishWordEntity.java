package com.me.shortcuts_api.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "english_word")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnglishWordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "theme_id", nullable = false)
    private ThemeEntity theme;

    private String word;
    private String translation;
    @Column(name = "learning_level")
    private int learningLevel = 1;
    private Boolean isDeleted = false;
}
