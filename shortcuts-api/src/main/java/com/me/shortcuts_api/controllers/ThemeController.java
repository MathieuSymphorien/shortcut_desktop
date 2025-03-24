package com.me.shortcuts_api.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.me.shortcuts_api.entities.DTO.EnglishWordDTO;
import com.me.shortcuts_api.entities.DTO.ThemeDTO;
import com.me.shortcuts_api.services.EnglishWordService;
import com.me.shortcuts_api.services.EnglishWordService;
import com.me.shortcuts_api.services.ThemeService;

import java.util.List;

@RestController
@RequestMapping("/theme")
public class ThemeController {

    @Autowired
    private EnglishWordService englishWordService;

    @Autowired
    private ThemeService ThemeService;
    
    // CREATE
    @PostMapping
    public ResponseEntity<ThemeDTO> createTheme(@RequestBody ThemeDTO dto) {
        ThemeDTO created = ThemeService.createTheme(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // READ All
    @GetMapping
    public List<ThemeDTO> getAllThemes() {
        return ThemeService.getAllThemes();
    }

    // READ One
    @GetMapping("/{id}")
    public ThemeDTO getOneTheme(@PathVariable Long id) {
        return ThemeService.getTheme(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ThemeDTO updateTheme(@PathVariable Long id,
                                     @RequestBody ThemeDTO dto) {
        return ThemeService.updateTheme(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTheme(@PathVariable Long id) {
        ThemeService.deleteTheme(id);
        return ResponseEntity.noContent().build();
    }

    // Get all words by theme
    @GetMapping("/{id}/words")
    public List<EnglishWordDTO> getWordsByTheme(@PathVariable Long id) {
        return englishWordService.getWordsByTheme(id);
    }

}
