package com.me.shortcuts_api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.me.shortcuts_api.entities.EnglishWordEntity;
import com.me.shortcuts_api.entities.ThemeEntity;

@Repository
public interface EnglishWordRepository extends JpaRepository<EnglishWordEntity, Long> {
    List<EnglishWordEntity> findByIsDeletedFalse();
    List<EnglishWordEntity> findByLearningLevelAndIsDeletedFalse(int level);
    List<EnglishWordEntity> findByThemeAndIsDeletedFalse(ThemeEntity theme);
    List<EnglishWordEntity> findByThemeAndLearningLevelAndIsDeletedFalse(ThemeEntity theme, int level);

    @Query(value = """
        SELECT * FROM english_word
        WHERE learning_level = :level AND is_deleted = false
        ORDER BY RANDOM()
        LIMIT :count
        """, nativeQuery = true)
    List<EnglishWordEntity> findRandomByLevelAndNotDeleted(@Param("level") int level, @Param("count") int count);

}

