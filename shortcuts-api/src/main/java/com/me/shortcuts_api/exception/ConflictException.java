package com.me.shortcuts_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception personnalisée pour les erreurs HTTP 409 (Conflict).
 * <p>Code 409 : conflit de ressources (doublon, violation contrainte, etc.).</p>
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}