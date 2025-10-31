package com.borakgul.demo.repository;

import com.borakgul.demo.model.Priority;
import com.borakgul.demo.model.Task;
import com.borakgul.demo.model.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Find by status
    List<Task> findByStatus(TaskStatus status);
    
    // Find by priority
    List<Task> findByPriority(Priority priority);
    
    // Find completed tasks
    List<Task> findByCompletedTrue();
    
    // Find pending tasks
    List<Task> findByCompletedFalse();
    
    // Find overdue tasks
    @Query("SELECT t FROM Task t WHERE t.dueDate < :now AND t.completed = false")
    List<Task> findOverdueTasks(@Param("now") LocalDateTime now);
    
    // Find tasks by title containing (case insensitive)
    List<Task> findByTitleContainingIgnoreCase(String title);
    
    // Find tasks created between dates
    List<Task> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Custom query for complex filtering
    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:completed IS NULL OR t.completed = :completed)")
    Page<Task> findTasksWithFilters(
        @Param("status") TaskStatus status,
        @Param("priority") Priority priority,
        @Param("completed") Boolean completed,
        Pageable pageable
    );
    
    // Bulk update status
    @Modifying
    @Query("UPDATE Task t SET t.status = :status WHERE t.id IN :ids")
    int updateTaskStatus(@Param("ids") List<Long> ids, @Param("status") TaskStatus status);
    
    // Count tasks by status
    long countByStatus(TaskStatus status);
    
    // Find high priority pending tasks
    @Query("SELECT t FROM Task t WHERE t.priority IN ('HIGH', 'URGENT') AND t.completed = false")
    List<Task> findHighPriorityPendingTasks();
}