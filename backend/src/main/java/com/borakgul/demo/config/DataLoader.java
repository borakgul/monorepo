package com.borakgul.demo.config;

import com.borakgul.demo.model.Priority;
import com.borakgul.demo.model.Task;
import com.borakgul.demo.model.TaskStatus;
import com.borakgul.demo.model.User;
import com.borakgul.demo.repository.TaskRepository;
import com.borakgul.demo.repository.UserRepository;
import com.borakgul.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

// @Component - Geçici olarak devre dışı (sample data sorunu var)
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {
    
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            loadSampleData();
        }
    }
    
    private void loadSampleData() {
        log.info("Loading sample data...");
        
        // 👤 Create sample users
        User adminUser = userService.registerUser("Admin User", "admin@example.com", "admin123");
        adminUser.setRole(User.Role.ADMIN);
        userRepository.save(adminUser);
        
        User normalUser = userService.registerUser("John Doe", "john@example.com", "password123");
        
        log.info("✅ Sample users created: admin@example.com, john@example.com");
        
        // Sample tasks
        Task task1 = new Task();
        task1.setTitle("Setup Development Environment");
        task1.setDescription("Install and configure all necessary development tools including IDE, Java, Maven, and PostgreSQL");
        task1.setPriority(Priority.HIGH);
        task1.setStatus(TaskStatus.DONE);
        task1.setCompleted(true);
        task1.setDueDate(LocalDateTime.now().minusDays(1));
        task1.setUser(adminUser);
        
        Task task2 = new Task();
        task2.setTitle("Design Database Schema");
        task2.setDescription("Create ERD and design the database schema for the task management system");
        task2.setPriority(Priority.HIGH);
        task2.setStatus(TaskStatus.IN_PROGRESS);
        task2.setCompleted(false);
        task2.setDueDate(LocalDateTime.now().plusDays(2));
        task2.setUser(normalUser);
        
        Task task3 = new Task();
        task3.setTitle("Implement REST API");
        task3.setDescription("Develop RESTful endpoints for CRUD operations on tasks");
        task3.setPriority(Priority.MEDIUM);
        task3.setStatus(TaskStatus.TODO);
        task3.setCompleted(false);
        task3.setDueDate(LocalDateTime.now().plusDays(5));
        task3.setUser(normalUser);
        
        Task task4 = new Task();
        task4.setTitle("Create React Frontend");
        task4.setDescription("Build responsive UI components using React and integrate with backend API");
        task4.setPriority(Priority.MEDIUM);
        task4.setStatus(TaskStatus.TODO);
        task4.setCompleted(false);
        task4.setDueDate(LocalDateTime.now().plusDays(7));
        task4.setUser(adminUser);
        
        Task task5 = new Task();
        task5.setTitle("Write Unit Tests");
        task5.setDescription("Create comprehensive unit tests for all service layers and controllers");
        task5.setPriority(Priority.LOW);
        task5.setStatus(TaskStatus.TODO);
        task5.setCompleted(false);
        task5.setDueDate(LocalDateTime.now().plusDays(10));
        task5.setUser(normalUser);
        
        Task task6 = new Task();
        task6.setTitle("Deploy to Azure");
        task6.setDescription("Setup CI/CD pipeline and deploy application to Azure cloud platform");
        task6.setPriority(Priority.URGENT);
        task6.setStatus(TaskStatus.TODO);
        task6.setCompleted(false);
        task6.setDueDate(LocalDateTime.now().plusDays(14));
        
        // Overdue task
        Task overdueTask = new Task();
        overdueTask.setTitle("Fix Critical Bug");
        overdueTask.setDescription("Investigate and fix the critical performance issue in production");
        overdueTask.setPriority(Priority.URGENT);
        overdueTask.setStatus(TaskStatus.IN_PROGRESS);
        overdueTask.setCompleted(false);
        overdueTask.setDueDate(LocalDateTime.now().minusDays(3));
        
        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);
        taskRepository.save(task4);
        taskRepository.save(task5);
        taskRepository.save(task6);
        taskRepository.save(overdueTask);
        
        log.info("Sample data loaded successfully! Created {} tasks", taskRepository.count());
    }
}