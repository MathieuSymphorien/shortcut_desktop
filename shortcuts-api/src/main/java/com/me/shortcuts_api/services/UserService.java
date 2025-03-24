package com.me.shortcuts_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.me.shortcuts_api.entities.UserEntity;
import com.me.shortcuts_api.entities.DTO.StreakUpdateResponseDTO;
import com.me.shortcuts_api.exception.NotFoundException;
import com.me.shortcuts_api.repositories.UserRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Charge l'utilisateur par son username, lève UsernameNotFoundException s'il n'existe pas.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + username));

        // Convertit le "role" stocké en base en collection de GrantedAuthorities
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }

   
    public StreakUpdateResponseDTO updateStreak(Long userId) {
        LocalDate today = LocalDate.now();
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        boolean jokerUsed = false;
        boolean streakReset = false;

        // Réinitialiser le joker tous les 7 jours
        if (user.getLastJokerResetDate() == null || user.getLastJokerResetDate().plusDays(7).isBefore(today)) {
            user.setJokersLeft(1);
            user.setLastJokerResetDate(today);
        }

        if (user.getLastActivityDate() == null || user.getLastActivityDate().isBefore(today)) {
            long daysSinceLast = user.getLastActivityDate() == null ? Long.MAX_VALUE : ChronoUnit.DAYS.between(user.getLastActivityDate(), today);

            if (daysSinceLast == 1) {
                user.setCurrentStreak(user.getCurrentStreak() + 1);
            } else if (daysSinceLast == 2 && user.getJokersLeft() > 0) {
                // Utilisation d’un joker
                user.setCurrentStreak(user.getCurrentStreak() + 1);
                user.setJokersLeft(user.getJokersLeft() - 1);
                jokerUsed = true;
            } else if (daysSinceLast > 1) {
                user.setCurrentStreak(1);
                streakReset = true;
            }

            // Mise à jour du maxStreak
            if (user.getCurrentStreak() > user.getMaxStreak()) {
                user.setMaxStreak(user.getCurrentStreak());
            }

            user.setLastActivityDate(today);
            userRepository.save(user);
        }

        return new StreakUpdateResponseDTO(
            user.getCurrentStreak(),
            user.getMaxStreak(),
            user.getJokersLeft(),
            jokerUsed,
            streakReset
        );
    }

    private UserEntity createNewStreak(Long userId) {
        UserEntity user = new UserEntity();
        user.setCurrentStreak(1);
        user.setMaxStreak(1);
        user.setLastActivityDate(LocalDate.now());
        user.setJokersLeft(1);
        user.setLastJokerResetDate(LocalDate.now());
        userRepository.save(user);
        return user;
    }
}
