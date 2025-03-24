package com.me.shortcuts_api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.me.shortcuts_api.entities.EnglishWordEntity;
import com.me.shortcuts_api.entities.ThemeEntity;

@Repository
public interface EnglishWordRepository extends JpaRepository<EnglishWordEntity, Long> {
    List<EnglishWordEntity> findByTheme(ThemeEntity theme);
    List<EnglishWordEntity> findByLearningLevel(int learningLevel);
    List<EnglishWordEntity> findByThemeAndLearningLevel(ThemeEntity theme, int learningLevel);
}

