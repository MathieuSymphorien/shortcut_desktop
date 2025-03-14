package com.me.shortcuts_api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.me.shortcuts_api.entities.UserEntity;

import java.util.Optional;
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
}