package com.me.shortcuts_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.me.shortcuts_api.entities.EnglishWordEntity;
import com.me.shortcuts_api.repositories.EnglishWordRepository;

import java.util.Map;

@Service
public class EnglishWordService {

    @Autowired
    private EnglishWordRepository repository;

    @Transactional
    public void importData(Map<String, Object> allData) {
        Object anglaisObj = allData.get(allData.keySet().iterator().next());    
        
        System.out.println("anglaisObj: " + anglaisObj);
        
    }
}
