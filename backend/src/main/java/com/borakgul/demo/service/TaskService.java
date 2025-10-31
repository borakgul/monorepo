package com.borakgul.demo.service;

import com.borakgul.demo.dto.CreateTaskRequest;
import com.borakgul.demo.dto.TaskResponse;
import com.borakgul.demo.dto.UpdateTaskRequest;
import com.borakgul.demo.model.Priority;
import com.borakgul.demo.model.Task;
import com.borakgul.demo.model.TaskStatus;
import com.borakgul.demo.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskService {
    
    private final TaskRepository taskRepository;
    
    public TaskResponse createTask(CreateTaskRequest request) {
        log.info("Creating new task with title: {}", request.getTitle());
        
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.TODO);
        task.setCompleted(false);
        
        Task savedTask = taskRepository.save(task);
        log.info("Task created with ID: {}", savedTask.getId());
        
        return new TaskResponse(savedTask);
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        log.info("Fetching all tasks");
        return taskRepository.findAll().stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        log.info("Fetching task with ID: {}", id);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
        return new TaskResponse(task);
    }
    
    public TaskResponse updateTask(Long id, UpdateTaskRequest request) {
        log.info("Updating task with ID: {}", id);
        
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
        
        // Update only non-null fields
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
            // Auto-update status based on completion
            if (request.getCompleted()) {
                task.setStatus(TaskStatus.DONE);
            }
        }
        
        Task updatedTask = taskRepository.save(task);
        log.info("Task updated successfully with ID: {}", id);
        
        return new TaskResponse(updatedTask);
    }
    
    public void deleteTask(Long id) {
        log.info("Deleting task with ID: {}", id);
        
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with ID: " + id);
        }
        
        taskRepository.deleteById(id);
        log.info("Task deleted successfully with ID: {}", id);
    }
    
    public TaskResponse markTaskAsCompleted(Long id) {
        log.info("Marking task as completed with ID: {}", id);
        
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
        
        task.markAsCompleted();
        Task updatedTask = taskRepository.save(task);
        
        return new TaskResponse(updatedTask);
    }
    
    public TaskResponse markTaskAsPending(Long id) {
        log.info("Marking task as pending with ID: {}", id);
        
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
        
        task.markAsPending();
        Task updatedTask = taskRepository.save(task);
        
        return new TaskResponse(updatedTask);
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByStatus(TaskStatus status) {
        log.info("Fetching tasks with status: {}", status);
        return taskRepository.findByStatus(status).stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getOverdueTasks() {
        log.info("Fetching overdue tasks");
        return taskRepository.findOverdueTasks(LocalDateTime.now()).stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getHighPriorityTasks() {
        log.info("Fetching high priority pending tasks");
        return taskRepository.findHighPriorityPendingTasks().stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksWithFilters(TaskStatus status, Priority priority, 
                                                  Boolean completed, Pageable pageable) {
        log.info("Fetching tasks with filters - Status: {}, Priority: {}, Completed: {}", 
                status, priority, completed);
        
        return taskRepository.findTasksWithFilters(status, priority, completed, pageable)
                .map(TaskResponse::new);
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> searchTasksByTitle(String title) {
        log.info("Searching tasks by title: {}", title);
        return taskRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }
}