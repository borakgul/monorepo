package com.borakgul.demo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * 🔑 JWT Token yönetim servisi
 * Token oluşturma, doğrulama ve parse etme işlemleri
 */
@Component
public class JwtTokenProvider {

    // 🔒 Güvenli secret key - Üretimde çevresel değişken olarak kullanılmalı
    @Value("${jwt.secret:mySecretKey1234567890mySecretKey1234567890}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}") // 24 saat (milisaniye)
    private Long expiration;

    /**
     * 🔑 Secret key oluşturma
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * 🎫 JWT Token oluşturma
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", userDetails.getUsername());
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * 🏗️ Token oluşturma - internal method
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * 📧 Token'dan email çıkarma
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * ⏰ Token'ın sona erme tarihini çıkarma
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * 📊 Token'dan claim çıkarma
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * 📋 Token'dan tüm claimleri çıkarma
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * ⏳ Token süresi dolmuş mu kontrolü
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * ✅ Token doğrulama
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * 🔍 Token geçerli mi kontrolü (kullanıcı bilgisi olmadan)
     */
    public Boolean isValidToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}