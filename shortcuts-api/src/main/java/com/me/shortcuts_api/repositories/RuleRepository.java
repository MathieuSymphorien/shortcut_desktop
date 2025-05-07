package com.me.shortcuts_api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.me.shortcuts_api.entities.RuleEntity;

public interface RuleRepository extends JpaRepository<RuleEntity, Long> { }
