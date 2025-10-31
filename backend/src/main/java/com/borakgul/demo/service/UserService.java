package com.borakgul.demo.service;

import com.borakgul.demo.model.User;
import com.borakgul.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 👤 User Service - Spring Security UserDetailsService implementasyonu
 * Kullanıcı yönetimi ve authentication işlemleri
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 🔍 Spring Security UserDetailsService implementation
     * Email ile kullanıcı bulma (authentication için)
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("🔍 Loading user by email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("❌ User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        log.debug("✅ User found: {} with role: {}", user.getEmail(), user.getRole());
        return user;
    }

    /**
     * 📝 Yeni kullanıcı kaydetme
     */
    public User registerUser(String name, String email, String password) {
        log.info("📝 Registering new user: {}", email);

        // Email kontrolü
        if (userRepository.existsByEmail(email)) {
            log.warn("⚠️ Email already exists: {}", email);
            throw new RuntimeException("Email already registered: " + email);
        }

        // Yeni kullanıcı oluştur
        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password)) // Şifreyi şifrele
                .role(User.Role.USER) // Varsayılan rol
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("✅ User registered successfully: {} with ID: {}", savedUser.getEmail(), savedUser.getId());
        
        return savedUser;
    }

    /**
     * 🔍 Email ile kullanıcı bulma
     */
    public Optional<User> findByEmail(String email) {
        log.debug("🔍 Finding user by email: {}", email);
        return userRepository.findByEmail(email);
    }

    /**
     * 🆔 ID ile kullanıcı bulma
     */
    public Optional<User> findById(Long id) {
        log.debug("🔍 Finding user by ID: {}", id);
        return userRepository.findById(id);
    }

    /**
     * 📋 Tüm kullanıcıları listele (Admin için)
     */
    public List<User> getAllUsers() {
        log.debug("📋 Fetching all users");
        return userRepository.findAll();
    }

    /**
     * 📊 Kullanıcı istatistikleri
     */
    public long getActiveUserCount() {
        return userRepository.countActiveUsers();
    }

    /**
     * 🔄 Kullanıcı durumunu değiştir (enable/disable)
     */
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        user.setEnabled(!user.isEnabled());
        User savedUser = userRepository.save(user);
        
        log.info("🔄 User status changed: {} - Enabled: {}", user.getEmail(), savedUser.isEnabled());
        return savedUser;
    }

    /**
     * 🔑 Şifre değiştirme
     */
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Eski şifre kontrolü
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            log.warn("⚠️ Password change failed - incorrect old password for: {}", email);
            throw new RuntimeException("Current password is incorrect");
        }

        // Yeni şifreyi kaydet
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        log.info("🔑 Password changed successfully for user: {}", email);
    }
}