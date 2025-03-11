package com.me.shortcuts_api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.me.shortcuts_api.entities.EnglishWordEntity;

@Repository
public interface EnglishWordRepository extends JpaRepository<EnglishWordEntity, Long> {
}

