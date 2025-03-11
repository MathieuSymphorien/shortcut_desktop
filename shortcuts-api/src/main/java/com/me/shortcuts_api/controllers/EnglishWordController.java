package com.me.shortcuts_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.me.shortcuts_api.entities.DTO.EnglishWordDTO;
import com.me.shortcuts_api.services.EnglishWordService;

import java.util.List;

@RestController
@RequestMapping("/english-words")
public class EnglishWordController {

    @Autowired
    private EnglishWordService englishWordService;
    
    // CREATE
    @PostMapping
    public ResponseEntity<EnglishWordDTO> createWord(@RequestBody EnglishWordDTO dto) {
        EnglishWordDTO created = englishWordService.createWord(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // READ All
    @GetMapping
    public List<EnglishWordDTO> getAllWords() {
        return englishWordService.getAllWords();
    }

    // READ One
    @GetMapping("/{id}")
    public EnglishWordDTO getOneWord(@PathVariable Long id) {
        return englishWordService.getWord(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public EnglishWordDTO updateWord(@PathVariable Long id,
                                     @RequestBody EnglishWordDTO dto) {
        return englishWordService.updateWord(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long id) {
        englishWordService.deleteWord(id);
        return ResponseEntity.noContent().build();
    }

}
