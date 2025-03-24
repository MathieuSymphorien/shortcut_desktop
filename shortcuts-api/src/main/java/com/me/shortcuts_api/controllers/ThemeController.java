package com.me.shortcuts_api.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.me.shortcuts_api.entities.DTO.ThemeDTO;
import com.me.shortcuts_api.services.ThemeService;

import java.util.List;

@RestController
@RequestMapping("/theme")
public class ThemeController {

    @Autowired
    private ThemeService ThemeService;
    
    // CREATE
    @PostMapping
    public ResponseEntity<ThemeDTO> createWord(@RequestBody ThemeDTO dto) {
        ThemeDTO created = ThemeService.createWord(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // READ All
    @GetMapping
    public List<ThemeDTO> getAllWords() {
        return ThemeService.getAllWords();
    }

    // READ One
    @GetMapping("/{id}")
    public ThemeDTO getOneWord(@PathVariable Long id) {
        return ThemeService.getWord(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ThemeDTO updateWord(@PathVariable Long id,
                                     @RequestBody ThemeDTO dto) {
        return ThemeService.updateWord(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long id) {
        ThemeService.deleteWord(id);
        return ResponseEntity.noContent().build();
    }

}
