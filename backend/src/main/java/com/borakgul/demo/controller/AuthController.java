package com.borakgul.demo.controller;

import com.borakgul.demo.config.JwtTokenProvider;
import com.borakgul.demo.dto.AuthResponse;
import com.borakgul.demo.dto.LoginRequest;
import com.borakgul.demo.dto.RegisterRequest;
import com.borakgul.demo.model.User;
import com.borakgul.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * 🔐 Authentication Controller
 * Kullanıcı kayıt, giriş ve profil yönetimi endpoint'leri
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 📝 User Registration
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        log.info("📝 Registration attempt for email: {}", request.getEmail());

        try {
            User user = userService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword()
            );

            log.info("✅ User registered successfully: {}", user.getEmail());
            
            return ResponseEntity.ok(AuthResponse.message(
                "User registered successfully. You can now login."
            ));

        } catch (RuntimeException e) {
            log.error("❌ Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(AuthResponse.message(
                "Registration failed: " + e.getMessage()
            ));
        }
    }

    /**
     * 🔐 User Login
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        log.info("🔐 Login attempt for email: {}", request.getEmail());

        try {
            // Spring Security ile authentication
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );

            // Security Context'e kaydet
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Kullanıcı bilgilerini al
            User user = (User) authentication.getPrincipal();

            // JWT Token oluştur
            String jwt = jwtTokenProvider.generateToken(user);

            log.info("✅ Login successful for user: {}", user.getEmail());

            // Response oluştur
            return ResponseEntity.ok(AuthResponse.success(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
            ));

        } catch (Exception e) {
            log.error("❌ Login failed for {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(AuthResponse.message(
                "Invalid email or password"
            ));
        }
    }

    /**
     * 👤 Get Current User Profile
     * GET /api/auth/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            // Security Context'ten authenticated user'ı al
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(AuthResponse.message("User not authenticated"));
            }

            User user = (User) authentication.getPrincipal();
            
            log.info("👤 Profile requested for user: {}", user.getEmail());

            // Token olmadan sadece user bilgileri döndür
            return ResponseEntity.ok(AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Profile retrieved successfully")
                .build());

        } catch (Exception e) {
            log.error("❌ Profile retrieval failed: {}", e.getMessage());
            return ResponseEntity.status(500).body(AuthResponse.message(
                "Failed to retrieve profile: " + e.getMessage()
            ));
        }
    }

    /**
     * 🚪 Logout (Client-side token removal)
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT stateless olduğu için server-side logout yok
        // Client token'ı silmeli
        log.info("🚪 Logout requested");
        
        return ResponseEntity.ok(AuthResponse.message(
            "Logout successful. Please remove token from client."
        ));
    }

    /**
     * 🔄 Token Refresh (Opsiyonel)
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(AuthResponse.message("User not authenticated"));
            }

            User user = (User) authentication.getPrincipal();
            String newToken = jwtTokenProvider.generateToken(user);
            
            log.info("🔄 Token refreshed for user: {}", user.getEmail());

            return ResponseEntity.ok(AuthResponse.success(
                newToken,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
            ));

        } catch (Exception e) {
            log.error("❌ Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(500).body(AuthResponse.message(
                "Token refresh failed: " + e.getMessage()
            ));
        }
    }
}