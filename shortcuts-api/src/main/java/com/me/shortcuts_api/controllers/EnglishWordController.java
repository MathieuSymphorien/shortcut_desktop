package com.me.shortcuts_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.me.shortcuts_api.services.EnglishWordService;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class EnglishWordController {

    @Autowired
    private EnglishWordService englishWordService;

    @PostMapping("/import")
    public ResponseEntity<Void> importData(@RequestBody Map<String, Object> allData) {
        englishWordService.importData(allData);
        return ResponseEntity.ok().build();
    }

}
