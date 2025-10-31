package com.borakgul.demo.config;

import com.borakgul.demo.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 🔍 JWT Authentication Filter
 * Her request'te JWT token'ı kontrol eder ve authentication context'ini ayarlar
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    @Lazy
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 🎫 Authorization header'ından JWT token'ı al
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Token yoksa veya Bearer ile başlamıyorsa, filtre zincirini devam ettir
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔑 Token'ı parse et (Bearer kısmını çıkar)
        jwt = authHeader.substring(7);
        
        try {
            // 📧 Token'dan email'i çıkar
            userEmail = jwtTokenProvider.extractEmail(jwt);

            // 🔒 Email varsa ve henüz authenticate edilmemişse
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // 👤 Kullanıcı bilgilerini yükle
                UserDetails userDetails = userService.loadUserByUsername(userEmail);

                // ✅ Token'ı doğrula
                if (jwtTokenProvider.validateToken(jwt, userDetails)) {
                    
                    // 🎯 Authentication token oluştur
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    // 📍 Request detaylarını ekle
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // 🏛️ Security context'e authentication'ı kaydet
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    log.debug("🔐 User '{}' authenticated successfully", userEmail);
                } else {
                    log.warn("⚠️ Invalid JWT token for user: {}", userEmail);
                }
            }
        } catch (Exception e) {
            log.error("❌ JWT authentication error: {}", e.getMessage());
        }

        // 🔄 Filtre zincirini devam ettir
        filterChain.doFilter(request, response);
    }
}