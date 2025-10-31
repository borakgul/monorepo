package com.borakgul.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 🎫 Authentication Response DTO
 * Login başarılı olduğunda dönen JWT token ve kullanıcı bilgileri
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String role;
    private String message;

    // JWT token ile birlikte kullanıcı bilgileri döndüren constructor
    public static AuthResponse success(String token, Long id, String name, String email, String role) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(id)
                .name(name)
                .email(email)
                .role(role)
                .message("Authentication successful")
                .build();
    }

    // Sadece mesaj döndüren constructor (kayıt başarılı gibi)
    public static AuthResponse message(String message) {
        return AuthResponse.builder()
                .message(message)
                .build();
    }
}