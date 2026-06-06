package com.vendorbridge.service;

import com.vendorbridge.config.JwtService;
import com.vendorbridge.dto.request.LoginRequest;
import com.vendorbridge.dto.request.RegisterRequest;
import com.vendorbridge.dto.response.AuthResponse;
import com.vendorbridge.entity.User;
import com.vendorbridge.enums.Role;
import com.vendorbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Parse role
        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }

        // Build and save user
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .country(request.getCountry())
                .additionalInfo(request.getAdditionalInfo())
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // Generate JWT
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return AuthResponse.of(
                token,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Account is deactivated. Contact admin.");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return AuthResponse.of(
                token,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name()
        );
    }
}
