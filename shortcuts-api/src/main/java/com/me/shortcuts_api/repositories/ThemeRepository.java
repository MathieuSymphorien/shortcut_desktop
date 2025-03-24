package com.me.shortcuts_api.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.me.shortcuts_api.entities.ThemeEntity;

@Repository
public interface ThemeRepository extends JpaRepository<ThemeEntity, Long> {
}
