package com.borakgul.demo.dto;

import com.borakgul.demo.model.Priority;
import com.borakgul.demo.model.TaskStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskRequest {
    
    @Size(min = 1, max = 100, message = "Title must be between 1 and 100 characters")
    private String title;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    private TaskStatus status;
    
    private Priority priority;
    
    private LocalDateTime dueDate;
    
    private Boolean completed;
}