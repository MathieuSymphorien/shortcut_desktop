package com.me.shortcuts_api.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.me.shortcuts_api.services.JwtService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {

        // Récupération de l'en-tête Authorization
        String authHeader = request.getHeader("Authorization");

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                // Valider + extraire le username
                String username = jwtService.extractUsername(token);

                // S'il n'y a pas déjà un objet d'authentification dans le contexte
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // On crée un simple objet d'authentification sans aller plus loin
                    // (optionnel : on pourrait recharger le user depuis la base pour ses rôles)
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(username, null, null);

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (ExpiredJwtException e) {
                // Token expiré
                System.out.println("Token expiré : " + e.getMessage());
            } catch (JwtException e) {
                System.out.println("Token invalide : " + e.getMessage());
            }
        }

        // Continuer
        filterChain.doFilter(request, response);
    }
}

