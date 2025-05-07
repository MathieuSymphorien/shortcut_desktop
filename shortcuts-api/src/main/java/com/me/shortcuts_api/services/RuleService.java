package com.me.shortcuts_api.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.me.shortcuts_api.entities.RuleEntity;
import com.me.shortcuts_api.entities.DTO.RuleDTO;
import com.me.shortcuts_api.exception.NotFoundException;
import com.me.shortcuts_api.repositories.RuleRepository;

import java.util.List;

@Service
public class RuleService {

    @Autowired private RuleRepository ruleRepository;

    public RuleDTO createRule(RuleDTO dto) {
        RuleEntity e = new RuleEntity();
        e.setTitle(dto.getTitle());
        e.setContent(dto.getContent());
        RuleEntity saved = ruleRepository.save(e);
        return toDTO(saved);
    }
    public RuleDTO getRule(Long id) {
        RuleEntity e = ruleRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Rule not found"));
        return toDTO(e);
    }
    public List<RuleDTO> getAllRules() {
        return ruleRepository.findAll()
            .stream().map(this::toDTO).toList();
    }
    public RuleDTO updateRule(Long id, RuleDTO dto) {
        RuleEntity e = ruleRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Rule not found"));
        e.setTitle(dto.getTitle());
        e.setContent(dto.getContent());
        return toDTO(ruleRepository.save(e));
    }
    public void deleteRule(Long id) {
        if (!ruleRepository.existsById(id)) {
            throw new NotFoundException("Rule not found");
        }
        ruleRepository.deleteById(id);
    }

    private RuleDTO toDTO(RuleEntity e) {
        return new RuleDTO(e.getId(), e.getTitle(), e.getContent());
    }
}
