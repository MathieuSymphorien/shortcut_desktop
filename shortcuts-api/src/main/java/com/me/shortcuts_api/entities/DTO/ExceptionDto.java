package com.me.shortcuts_api.entities.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExceptionDto {
    private String summary;
    private String message;
    private String status;
    private String error;
    private String timestamp;
}