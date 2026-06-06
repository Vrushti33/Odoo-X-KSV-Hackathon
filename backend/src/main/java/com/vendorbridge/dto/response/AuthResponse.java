package com.vendorbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String type;
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;

    public static AuthResponse of(String token, Long id, String email, String firstName, String lastName, String role) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(id)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .role(role)
                .build();
    }
}
