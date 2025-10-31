package com.borakgul.demo.repository;

import com.borakgul.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 🗃️ User Repository - Spring Security için kullanıcı işlemleri
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Email ile kullanıcı bulma - Authentication için
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Email'in daha önce kullanılıp kullanılmadığını kontrol etme
     */
    boolean existsByEmail(String email);
    
    /**
     * Aktif kullanıcıları sayma
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.enabled = true")
    long countActiveUsers();
    
    /**
     * Role göre kullanıcı bulma
     */
    @Query("SELECT u FROM User u WHERE u.role = :role")
    java.util.List<User> findByRole(User.Role role);
}