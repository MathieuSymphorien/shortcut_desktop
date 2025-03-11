package com.me.shortcuts_api.services;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET;
    
    static {
        // Génération d'une clé secrète 256 bits encodée en Base64
        byte[] key = new byte[32]; // 256 bits = 32 bytes
        new SecureRandom().nextBytes(key);
        SECRET = Base64.getEncoder().encodeToString(key);
        System.out.println("Clé secrète générée : " + SECRET);
    }
    // Durée de validité (par ex. 1 heure = 3600000 ms)
    private static final long EXPIRATION = 3600000;

    /**
     * Génère un token avec le "subject" = username.
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extrait le username du token si la signature et la date sont valides.
     */
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
