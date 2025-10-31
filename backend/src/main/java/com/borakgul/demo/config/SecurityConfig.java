package com.borakgul.demo.config;

import com.borakgul.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * 🔒 Spring Security Configuration
 * JWT Authentication + CORS + Role-based Access Control
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    @Lazy
    private final UserService userService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final PasswordEncoder passwordEncoder;

    /**
     * 🔐 Security Filter Chain Configuration
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF devre dışı (JWT kullanıyoruz)
            .csrf(AbstractHttpConfigurer::disable)
            
            // CORS ayarları
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Session management - Stateless (JWT)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Authentication entry point
            .exceptionHandling(exceptions -> 
                exceptions.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            
            // Authorization rules
            .authorizeHttpRequests(authz -> authz
                // 🚫 Public endpoints - Kimlik doğrulama gerektirmez
                .requestMatchers(
                    "/api/auth/**",           // Auth endpoints
                    "/api/tasks/health",      // Health check
                    "/h2-console/**",         // H2 Database console
                    "/actuator/**",           // Spring Boot Actuator
                    "/error"                  // Error page
                ).permitAll()
                
                // 👨‍💼 Admin only endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // 🔒 Tüm diğer endpointler authentication gerektirir
                .anyRequest().authenticated()
            )
            
            // JWT Authentication Filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            // Authentication Provider
            .authenticationProvider(authenticationProvider());

        // H2 Console için frame options
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }



    /**
     * 🏭 Authentication Provider Bean
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    /**
     * 🔐 Authentication Manager Bean
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * 🌐 CORS Configuration Source
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Frontend URL'leri
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:3000",   // React dev server
            "http://localhost:5173",   // Vite dev server
            "http://localhost:*"       // Diğer local portlar
        ));
        
        // HTTP metodları
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // Headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Credentials
        configuration.setAllowCredentials(true);
        
        // Cache süresi (1 saat)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        source.registerCorsConfiguration("/actuator/**", configuration); // Actuator endpoints için CORS

        return source;
    }
}