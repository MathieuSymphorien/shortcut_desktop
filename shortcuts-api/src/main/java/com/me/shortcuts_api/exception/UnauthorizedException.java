package com.me.shortcuts_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception personnalisée pour les erreurs HTTP 401 (Unauthorized).
 * <p>Code 401 : la requête requiert une authentification (token, etc.).</p>
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}