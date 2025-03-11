package com.me.shortcuts_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception personnalisée pour les erreurs HTTP 403 (Forbidden).
 * <p>Code 403 : l’utilisateur est authentifié mais n’a pas les droits suffisants.</p>
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}