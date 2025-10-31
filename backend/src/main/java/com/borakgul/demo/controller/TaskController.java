package com.borakgul.demo.controller;

import com.borakgul.demo.dto.CreateTaskRequest;
import com.borakgul.demo.dto.TaskResponse;
import com.borakgul.demo.dto.UpdateTaskRequest;
import com.borakgul.demo.model.Priority;
import com.borakgul.demo.model.TaskStatus;
import com.borakgul.demo.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {
    
    private final TaskService taskService;
    
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        log.info("REST request to create task: {}", request.getTitle());
        TaskResponse response = taskService.createTask(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        log.info("REST request to get all tasks");
        List<TaskResponse> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        log.info("REST request to get task by ID: {}", id);
        TaskResponse task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, 
                                                  @Valid @RequestBody UpdateTaskRequest request) {
        log.info("REST request to update task ID: {}", id);
        TaskResponse response = taskService.updateTask(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable Long id) {
        log.info("REST request to delete task ID: {}", id);
        taskService.deleteTask(id);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }
    
    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> markTaskAsCompleted(@PathVariable Long id) {
        log.info("REST request to mark task as completed ID: {}", id);
        TaskResponse response = taskService.markTaskAsCompleted(id);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/pending")
    public ResponseEntity<TaskResponse> markTaskAsPending(@PathVariable Long id) {
        log.info("REST request to mark task as pending ID: {}", id);
        TaskResponse response = taskService.markTaskAsPending(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskResponse>> getTasksByStatus(@PathVariable TaskStatus status) {
        log.info("REST request to get tasks by status: {}", status);
        List<TaskResponse> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/overdue")
    public ResponseEntity<List<TaskResponse>> getOverdueTasks() {
        log.info("REST request to get overdue tasks");
        List<TaskResponse> tasks = taskService.getOverdueTasks();
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/high-priority")
    public ResponseEntity<List<TaskResponse>> getHighPriorityTasks() {
        log.info("REST request to get high priority tasks");
        List<TaskResponse> tasks = taskService.getHighPriorityTasks();
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<TaskResponse>> searchTasks(@RequestParam String title) {
        log.info("REST request to search tasks by title: {}", title);
        List<TaskResponse> tasks = taskService.searchTasksByTitle(title);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/filter")
    public ResponseEntity<Page<TaskResponse>> getTasksWithFilters(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        log.info("REST request to filter tasks - Status: {}, Priority: {}, Completed: {}", 
                status, priority, completed);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TaskResponse> tasks = taskService.getTasksWithFilters(status, priority, completed, pageable);
        
        return ResponseEntity.ok(tasks);
    }
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Task Management API",
                "timestamp", System.currentTimeMillis()
        ));
    }
}