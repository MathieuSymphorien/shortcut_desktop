package com.me.shortcuts_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.me.shortcuts_api.entities.EnglishWordEntity;
import com.me.shortcuts_api.entities.ThemeEntity;
import com.me.shortcuts_api.entities.DTO.EnglishWordDTO;
import com.me.shortcuts_api.exception.BadRequestException;
import com.me.shortcuts_api.exception.NotFoundException;
import com.me.shortcuts_api.repositories.EnglishWordRepository;
import com.me.shortcuts_api.repositories.ThemeRepository;

import java.util.List;

@Service
public class EnglishWordService {

    @Autowired
    private EnglishWordRepository englishWordRepository;

    @Autowired
    private ThemeRepository themeRepository;


    /**
     * Crée un enregistrement à partir du DTO, le sauvegarde en base, puis retourne
     * un nouveau DTO qui reflète l'entité persitée.
     */
    public EnglishWordDTO createWord(EnglishWordDTO dto) {
        if (dto.getWord() == null || dto.getWord().trim().isEmpty()) {
            throw new BadRequestException("Field 'word' can't be empty.");
        }
        EnglishWordEntity entity = toEntity(dto);
        EnglishWordEntity saved = englishWordRepository.save(entity);
        return toDTO(saved);
    }

    public EnglishWordDTO getWord(Long id) {
        EnglishWordEntity entity = englishWordRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Word not found"));
        return toDTO(entity);
    }

    public List<EnglishWordDTO> getAllWords() {
        List<EnglishWordEntity> entities = englishWordRepository.findAll();
        return entities.stream()
                .map(this::toDTO)
                .toList();
    }

    public EnglishWordDTO updateWord(Long id, EnglishWordDTO dto) {
        EnglishWordEntity entity = englishWordRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Word not found"));

        entity.setTheme(
            themeRepository.findByTheme(dto.getTheme())
                .orElseThrow(() -> new BadRequestException("Theme not found: " + dto.getTheme()))
        );
        entity.setWord(dto.getWord());
        entity.setTranslation(dto.getTranslation());
        entity.setLearningLevel(dto.getLearningLevel());

        EnglishWordEntity updated = englishWordRepository.save(entity);
        return toDTO(updated);
    }

    public void deleteWord(Long id) {
        if (!englishWordRepository.existsById(id)) {
            throw new  NotFoundException("Word not found");
        }
        englishWordRepository.deleteById(id);
    }

    // ----- Mapping methods -----

    private EnglishWordEntity toEntity(EnglishWordDTO dto) {
    ThemeEntity theme = themeRepository.findByTheme(dto.getTheme())
            .orElseThrow(() -> new BadRequestException("Theme not found: " + dto.getTheme()));

        EnglishWordEntity entity = new EnglishWordEntity();
        entity.setTheme(theme);
        entity.setWord(dto.getWord());
        entity.setTranslation(dto.getTranslation());
        entity.setLearningLevel(dto.getLearningLevel());
        entity.setIsDeleted(dto.getIsDeleted());
        return entity;
    }

    private EnglishWordDTO toDTO(EnglishWordEntity entity) {
        return new EnglishWordDTO(
            entity.getId(),
            entity.getTheme().getTheme(),
            entity.getWord(),
            entity.getTranslation(),
            entity.getLearningLevel(),
            entity.getIsDeleted()
        );
    }    
}
