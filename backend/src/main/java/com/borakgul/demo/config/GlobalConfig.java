package com.borakgul.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 🔐 Global Configuration
 * Circular dependency'leri önlemek için global bean'ler
 */
@Configuration
public class GlobalConfig {

    /**
     * 🔒 Password Encoder Bean (Global)
     * SecurityConfig'den ayrılarak circular dependency çözüldü
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}