package com.me.shortcuts_api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.me.shortcuts_api.entities.ThemeEntity;
import com.me.shortcuts_api.entities.DTO.ThemeDTO;
import com.me.shortcuts_api.exception.BadRequestException;
import com.me.shortcuts_api.exception.NotFoundException;
import com.me.shortcuts_api.repositories.ThemeRepository;

@Service
public class ThemeService {
    @Autowired
    private ThemeRepository themeRepository;

    public ThemeDTO createWord(ThemeDTO dto) {
        if (dto.getTheme() == null || dto.getTheme().trim().isEmpty()) {
            throw new BadRequestException("Field 'theme' can't be empty.");
        }
        ThemeEntity entity = toEntity(dto);
        ThemeEntity saved = themeRepository.save(entity);
        return toDTO(saved);
    }

    public ThemeDTO getWord(Long id) {
        ThemeEntity entity = themeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Theme not found"));
        return toDTO(entity);
    }

    public List<ThemeDTO> getAllWords() {
        List<ThemeEntity> entities = themeRepository.findAll();
        return entities.stream()
                .map(this::toDTO)
                .toList();
    }

    public ThemeDTO updateWord(Long id, ThemeDTO dto) {
        ThemeEntity entity = themeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Theme not found"));

        // Mise à jour des champs depuis le DTO
        entity.setTheme(dto.getTheme());

        ThemeEntity updated = themeRepository.save(entity);
        return toDTO(updated);
    }

    public void deleteWord(Long id) {
        if (!themeRepository.existsById(id)) {
            throw new  NotFoundException("Theme not found");
        }
        themeRepository.deleteById(id);
    }

    // ----- Mapping methods -----

    private ThemeEntity toEntity(ThemeDTO dto) {
        ThemeEntity entity = new ThemeEntity();
        entity.setTheme(dto.getTheme());
        return entity;
    }

    private ThemeDTO toDTO(ThemeEntity entity) {
        return new ThemeDTO(
                entity.getId(),
                entity.getTheme()
        );
    }
}
