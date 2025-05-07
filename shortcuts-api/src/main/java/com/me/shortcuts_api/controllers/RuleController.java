package com.me.shortcuts_api.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

import com.me.shortcuts_api.entities.DTO.RuleDTO;
import com.me.shortcuts_api.services.RuleService;

import java.util.List;

@RestController
@RequestMapping("/rules")
public class RuleController {

    private final RuleService ruleService;
    public RuleController(RuleService ruleService) {
        this.ruleService = ruleService;
    }

    @PostMapping
    public ResponseEntity<RuleDTO> create(@RequestBody RuleDTO dto) {
        RuleDTO created = ruleService.createRule(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public List<RuleDTO> all() {
        return ruleService.getAllRules();
    }

    @GetMapping("/{id}")
    public RuleDTO one(@PathVariable Long id) {
        return ruleService.getRule(id);
    }

    @PutMapping("/{id}")
    public RuleDTO update(@PathVariable Long id, @RequestBody RuleDTO dto) {
        return ruleService.updateRule(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ruleService.deleteRule(id);
        return ResponseEntity.noContent().build();
    }

}
